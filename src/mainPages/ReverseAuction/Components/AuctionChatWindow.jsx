import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  Paper,
  useTheme,
  ListItemButton,
  Chip,
  Stack,
  Input,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import reverseAuctionApi from "../../../backend/db/reverseAuctionApi";
import { useAuth } from "../../../context/AuthContext";
import { useWebSocket } from "../../../context/WebSocketContext";
import { toast } from "react-toastify";

// Mock chat messages for realism
const mockMessages = [
  // { id: 1, user: "User1", text: "Tôi muốn đặt giá 55 triệu!", timestamp: "10:50 PM", isOwnMessage: false },
  // { id: 2, user: "User2", text: "Hiện tại giá cao nhất là 60 triệu.", timestamp: "10:52 PM", isOwnMessage: false },
  // { id: 3, user: "You", text: "Tôi bid 65 triệu!", timestamp: "10:53 PM", isOwnMessage: true },
];

function AuctionChatWindow({ open, onClose, item }) {
  const theme = useTheme();
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  // Mock room data
  const [chatRooms, setChatRoom] = useState([])
  const [chatRoomsNotification, setChatRoomsNotification] = useState({})
  const chatEndRef = useRef(null);
  const { connected, sendMessage, subscribe } = useWebSocket();

  // xác thực trạng thái 2 bên
  const [agreementStatus, setAgreementStatus] = useState({
    myStatus: 'pending', // Trạng thái có thể là: 'pending', 'accepted', 'denied'
    otherPartyStatus: 'pending',
  });

  const handleUpdate = () => {

  }

  const handleAccept = () => {
    sendMessage(`/api/reverse-auction/sendMessage`, {
      senderId: user.id,
      roomId: selectedRoom,
      type: agreementStatus.myStatus === 'accepted' ? 'PENDING' : 'ACCEPT',
    })
  };

  const handleDeny = () => {
    sendMessage(`/api/reverse-auction/sendMessage`, {
      senderId: user.id,
      roomId: selectedRoom,
      type: agreementStatus.myStatus === 'denied' ? 'PENDING' : 'REJECT',
    })
  };

  const actionDisabled = agreementStatus.myStatus !== 'pending' && agreementStatus.otherPartyStatus !== 'pending' && agreementStatus.myStatus === agreementStatus.otherPartyStatus;

  // Hàm helper để hiển thị Chip trạng thái cho đẹp
  const renderStatusChip = (status) => {
    switch (status) {
      case 'accepted':
        return <Chip label="Chấp nhận" color="success" size="small" />;
      case 'denied':
        return <Chip label="Từ chối" color="error" size="small" />;
      default:
        return <Chip label="Đang chờ" color="default" size="small" />;
    }
  };

  // Hàm helper để convert từ BE về FE
  const convertState = (status) => {
    switch (status) {
      case 'Approved':
        return 'accepted';
      case 'Rejected':
        return 'denied';
      default:
        return 'pending';
    }
  };




  // Fetch and Update Chat Windows
  useEffect(() => {
    if (!user || !item?.id) {
      return;
    }

    let activeSubscriptions = [];
    const fetchAndSubscribe = async () => {
      try {
        const uhm = await reverseAuctionApi.getRoomChat({ userID: user.id, productID: item.id });
        const rooms = uhm.roomList || []; // Đảm bảo rooms luôn là một mảng
        console.log("Room chat fetched for user:", user.id, rooms);
        setChatRoom(rooms);

        rooms.forEach((room) => {
          console.log("Đăng kí cho phòng chat ID:", room.roomID);
          setChatRoomsNotification((prev) => {
            return { ...prev, [room.roomID]: prev[room.roomID] || 0 }
          })

          const subscription = subscribe(
            `/topic/reverse-auction/${room.roomID}`,
            (received) => {
              console.log("PING, new message found for room:", received.roomId, selectedRoom, received.roomId == selectedRoom);
              if (received.roomId == selectedRoom) {
                // append message
                setMessages(prev => [...prev,
                {
                  id: received.id,
                  user: received.senderId === user.id ? "You" : received.senderId === room.collaboratorUserID ? room.collaboratorName : "Unknown",
                  text: received.content,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  isOwnMessage: received.senderId === user?.id,
                },
                ]);
                // accept/deny/pending 
                if (received.type === 'ACCEPT') {
                  console.log("User clicked ACCEPT");
                  // Gọi API và cập nhật state
                  if (received.senderId === user?.id)
                    setAgreementStatus(prev => ({ ...prev, myStatus: 'accepted' }));
                  else
                    setAgreementStatus(prev => ({ ...prev, otherPartyStatus: 'accepted' }));
                }
                else if (received.type === 'REJECT') {
                  console.log("User clicked DENY");
                  // Gọi API và cập nhật state
                  if (received.senderId === user?.id)
                    setAgreementStatus(prev => ({ ...prev, myStatus: 'denied' }));
                  else
                    setAgreementStatus(prev => ({ ...prev, otherPartyStatus: 'denied' }));
                }
                else if (received.type === 'PENDING') {
                  console.log("User clicked PENDING");
                  // Gọi API và cập nhật state
                  if (received.senderId === user?.id)
                    setAgreementStatus(prev => ({ ...prev, myStatus: 'pending' }));
                  else
                    setAgreementStatus(prev => ({ ...prev, otherPartyStatus: 'pending' }));
                }
                // reset counter to 0
                setChatRoomsNotification(prev => {
                  return {
                    ...prev,
                    [room.roomID]: received.senderId === user?.id ? 0 : prev[room.roomID] + 1
                  }
                })
              } else if (received.roomId == room.roomID) {
                // reset counter to 0
                setChatRoomsNotification(prev => {
                  return {
                    ...prev,
                    [received.roomId]: prev[received.roomId] + 1
                  }
                })
              }
            }
          );

          // Thêm subscription vào mảng để quản lý
          if (subscription) {
            activeSubscriptions.push(subscription);
          }
        });
      } catch (err) {
        toast.error(JSON.stringify(err));
      }
    };

    fetchAndSubscribe();

    return () => {
      console.log("Cleaning up subscriptions for user:", user.id);
      activeSubscriptions.forEach(sub => {
        // Kiểm tra chắc chắn trước khi hủy
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe();
        }
      });
    };

  }, [user, item?.id, subscribe, selectedRoom]);



  // On select chat room, append with history
  useEffect(() => {
    const isAuthorOfAuction = () => {
      return user?.id && item?.auctionProductDTO?.author_id === user.id;
    };
    if (!chatRooms || chatRooms.length <= 0) return;

    if (selectedRoom != null) {
      let currentRoom = chatRooms.find(room => room.roomID === selectedRoom)
      if (currentRoom) {
        if (isAuthorOfAuction())
          setAgreementStatus({
            myStatus: convertState(currentRoom.status),
            otherPartyStatus: convertState(currentRoom.statusCTV),
          })
        else
          setAgreementStatus({
            myStatus: convertState(currentRoom.statusCTV),
            otherPartyStatus: convertState(currentRoom.status),
          })
      }

      reverseAuctionApi.getRoomChatHistory(selectedRoom).then(response => {
        console.log(item)
        setMessages(response.data.map(chatMsg => {
          return {
            id: chatMsg.id,
            user: chatMsg.senderId === user.id ? "You" : chatMsg.senderId === item.collaboratorUserID ? item.collaboratorName : "Unknown",
            text: chatMsg.content,
            timestamp: new Date(chatMsg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwnMessage: chatMsg.senderId === user?.id,
          }
        }))
      })
    }

  }, [selectedRoom, item, user?.id, chatRooms])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(`/api/reverse-auction/sendMessage`, {
        content: message,
        senderId: user.id,
        roomId: selectedRoom,
        type: 'MESSAGE',
      })
      setMessage("");
    }
  };

  let currentRoom = chatRooms.find(room => room.roomID === selectedRoom)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: theme.palette.mode === "dark" ? "linear-gradient(145deg, #1e1e1e, #2a2a2a)" : "#fff",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h5" fontWeight="bold">
          Phòng đấu giá
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ display: "flex", height: "80vh", p: 0, bgcolor: theme.palette.background.default }}>
        {/* Left: Chat Rooms List */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: "100%", md: "25%" },
            p: 2,
            borderRight: { md: `1px solid ${theme.palette.divider}` },
            bgcolor: theme.palette.mode === "dark" ? "#2a2a2a" : "#f9fafb",
            borderRadius: { xs: 0, md: "8px 0 0 8px" },
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" fontWeight="600" mb={2}>
            Danh sách phòng chat
          </Typography>
          <List>
            <AnimatePresence>
              {chatRooms && chatRooms.map((room) => (
                <motion.div
                  key={room.roomID}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListItemButton
                    button
                    selected={selectedRoom === room.roomID}
                    onClick={() => setSelectedRoom(room.roomID)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: selectedRoom === room.roomID ? theme.palette.primary.light : "transparent",
                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                        transform: "translateX(5px)",
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  >
                    <ListItemText
                      primary={room.collaboratorName}
                      secondary={`Giá đề xuất: ${room.proposingPrice.toLocaleString()} VNĐ (${chatRoomsNotification[room.roomID] || 0})`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItemButton>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        </Paper>

        {/* Center: Chat and Product Info */}
        <Box sx={{ width: { xs: "100%", md: "70%" }, display: "flex", flexDirection: "column" }}>
          {/* Product Info */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
              display: 'flex',
              flexDirection: `row`
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="600" mb={1}>
                Thông tin sản phẩm
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1 }}>
                <Typography>
                  <strong>Tên:</strong> <Input name="productName" placeholder="N/A" value={item.name} />
                </Typography>
                <Typography>
                  <strong>Giá khởi điểm:</strong> <Input name="productName" placeholder="0" value={item.price?.toLocaleString()} /> VNĐ
                </Typography>
                <Typography>
                  <strong>Giá thỏa thuận:</strong> <Input name="productName" placeholder="0" value={currentRoom?.proposingPrice?.toLocaleString()} /> VNĐ
                </Typography>
                <Typography>
                  <strong>Vật liệu:</strong> <Input name="productName" placeholder="N/A" value={item.productMaterial} />
                </Typography>
                <Typography>
                  <strong>Kích thước:</strong> <Input name="productName" placeholder="N/A" value={item.size} />
                </Typography>
                <Typography>
                  <strong>Dịp:</strong> <Input name="productName" placeholder="N/A" value={item.occasion} />
                </Typography>
                <Typography>
                  <strong>Mô tả:</strong> <Input name="productName" placeholder="Không có mô tả" value={item.description} />
                </Typography>
              </Box>

            </Box>

            <Divider sx={{ my: 3 }} />

            {/* STatus */}
            <Box>
              <Typography variant="h6" fontWeight="600" mb={2}>
                Trạng thái thoả thuận
              </Typography>
              {
                selectedRoom ? (

                  <Stack spacing={1.5}>
                    {/* Hiển thị trạng thái */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1">Trạng thái của bạn:</Typography>
                      {renderStatusChip(agreementStatus.myStatus)}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1">Trạng thái đối phương:</Typography>
                      {renderStatusChip(agreementStatus.otherPartyStatus)}
                    </Box>

                    {/* Các nút hành động */}
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      
                      <Button
                        variant="outlined"
                        color="info"
                        onClick={handleUpdate}
                        disabled={actionDisabled}
                        fullWidth
                      >
                        Cập nhật
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={handleAccept}
                        disabled={actionDisabled}
                        fullWidth
                      >
                        Chấp nhận
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDeny}
                        disabled={actionDisabled}
                        fullWidth
                      >
                        Từ chối
                      </Button>
                    </Stack>
                  </Stack>
                ) : (<>"Vui lòng chọn phòng chat để xem"</>)
              }
            </Box>
          </Box>

          {/* Chat Area */}
          <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: theme.palette.background.paper }}>
            <Typography variant="h6" fontWeight="600" mb={2}>
              Chat giao dịch
            </Typography>
            <Box sx={{ flex: 1, overflowY: "auto", mb: 2, pr: 0 }}>
              {selectedRoom ? (
                <AnimatePresence>
                  {messages && messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      sx={{
                        display: "flex",
                        justifyContent: msg.isOwnMessage ? "flex-end" : "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "95%",
                          marginBottom: "5px",
                          display: "flex",
                          flexDirection: msg.isOwnMessage ? "row-reverse" : "row",
                          alignItems: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: msg.isOwnMessage
                              ? theme.palette.primary.main
                              : theme.palette.secondary.main,
                          }}
                        >
                          {msg.user}
                        </Avatar>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: msg.isOwnMessage
                              ? theme.palette.primary.light
                              : theme.palette.grey[100],
                            color: theme.palette.text.primary,
                          }}
                        >
                          <Typography variant="body2">{msg.text}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {msg.timestamp}
                          </Typography>
                        </Paper>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                  Vui lòng chọn một phòng chat để bắt đầu
                </Typography>
              )}
              <div ref={chatEndRef} />
            </Box>
            <Box sx={{ display: "flex", gap: 1, p: 1, bgcolor: theme.palette.background.paper }}>
              <TextField
                fullWidth
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: theme.palette.mode === "dark" ? "#333" : "#fff",
                  },
                }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
                disabled={!message.trim() || !selectedRoom}
                sx={{ borderRadius: 3, px: 3 }}
              >
                Gửi
              </Button>
            </Box>
          </Box>
        </Box>

      </DialogContent>
    </Dialog>
  );
}

export default AuctionChatWindow;