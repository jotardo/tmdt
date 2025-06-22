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
  { id: 1, user: "User1", text: "Tôi muốn đặt giá 55 triệu!", timestamp: "10:50 PM", isOwnMessage: false },
  { id: 2, user: "User2", text: "Hiện tại giá cao nhất là 60 triệu.", timestamp: "10:52 PM", isOwnMessage: false },
  { id: 3, user: "You", text: "Tôi bid 65 triệu!", timestamp: "10:53 PM", isOwnMessage: true },
];

function AuctionChatWindow({ open, onClose, item }) {
  const theme = useTheme();
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const chatEndRef = useRef(null);
  const { connected, sendMessage, subscribe } = useWebSocket();

  // Mock room data - replace with actual API data
  const [chatRooms, setChatRoom] = useState([])
  // [
  //   { id: 1, name: "Phòng đấu giá Kim cương", product: "Nhẫn kim cương 2 carat" },
  //   { id: 2, name: "Phòng đấu giá Vàng", product: "Vòng cổ vàng 18K" },
  //   { id: 3, name: "Phòng đấu giá Ngọc trai", product: "Bông tai ngọc trai" },
  // ];


  useEffect(() => {
    // Nếu không có user hoặc item thì không làm gì cả
    if (!user || !item?.id) {
      return;
    }

    // 1. Tạo một mảng để lưu lại tất cả các subscription sẽ được tạo ra
    let activeSubscriptions = [];

    const fetchAndSubscribe = async () => {
      try {
        const uhm = await reverseAuctionApi.getRoomChat({ userID: user.id, productID: item.id });
        const rooms = uhm.roomList || []; // Đảm bảo rooms luôn là một mảng
        console.log("Room chat fetched for user:", user.id, rooms);
        setChatRoom(rooms);

        rooms.forEach((room) => {
          console.log("Đăng kí cho phòng chat ID:", room.roomID);

          // 2. Gọi subscribe và lưu lại đối tượng subscription
          const subscription = subscribe(
            `/topic/reverse-auction/${room.roomID}`,
            (received) => {
              // Logic xử lý tin nhắn nhận được (đã khá ổn)
              // Nên kiểm tra xem selectedRoom có được cập nhật đúng không
              console.log("PING, new message found for room:", received.roomId, selectedRoom, received.roomId == selectedRoom);
              if (received.roomId == selectedRoom) {
                setMessages(prev => [...prev,
                {
                  id: received.id,
                  user: received.senderId === item.collaboratorID ? item.collaboratorName : "Unknown",
                  text: received.content,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  isOwnMessage: received.senderId === user?.id,
                },
                ]);
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

    // 3. TRẢ VỀ HÀM DỌN DẸP (CLEANUP FUNCTION)
    // Hàm này sẽ được gọi khi component unmount, hoặc khi user/item thay đổi
    return () => {
      console.log("Cleaning up subscriptions for user:", user.id);
      activeSubscriptions.forEach(sub => {
        // Kiểm tra chắc chắn trước khi hủy
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe();
        }
      });
    };

    // 4. CẬP NHẬT DEPENDENCY ARRAY
    // Thêm item.id và subscribe để đảm bảo effect chạy lại khi cần
  }, [user, item?.id, subscribe, selectedRoom]);


  // on select chat room, append with history
  useEffect(() => {
    if (selectedRoom != null) {
      reverseAuctionApi.getRoomChatHistory(selectedRoom).then(response => {
        console.log("Room chat fetched", selectedRoom, response.data)
        setMessages(response.data.map(chatMsg => {
          return {
            id: chatMsg.id,
            user: chatMsg.senderId === item.collaboratorID ? item.collaboratorName : "Unknown",
            text: chatMsg.content,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwnMessage: chatMsg.senderId === user?.id,
          }
        }))
      })
    }

  }, [selectedRoom])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(`/api/reverse-auction/sendMessage`, {
        content: message,
        senderId: user.id,
        roomId: selectedRoom
      })
      setMessage("");
    }
  };

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
            width: { xs: "100%", md: "30%" },
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
                      secondary={`${room.roomID} - ${room.proposingPrice}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItemButton>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        </Paper>

        {/* Right: Chat and Product Info */}
        <Box sx={{ width: { xs: "100%", md: "70%" }, display: "flex", flexDirection: "column" }}>
          {/* Product Info */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
            }}
          >
            <Typography variant="h6" fontWeight="600" mb={1}>
              Thông tin sản phẩm
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
              <Typography>
                <strong>Tên:</strong> {item.name}
              </Typography>
              <Typography>
                <strong>Giá khởi điểm:</strong> {item.price?.toLocaleString() || 0} VNĐ
              </Typography>
              <Typography>
                <strong>Vật liệu:</strong> {item.material || "N/A"}
              </Typography>
              <Typography>
                <strong>Kích thước:</strong> {item.size || "N/A"}
              </Typography>
              <Typography>
                <strong>Dịp:</strong> {item.occasion || "N/A"}
              </Typography>
              <Typography>
                <strong>Mô tả:</strong> {item.description || "Không có mô tả"}
              </Typography>
            </Box>
          </Box>

          {/* Chat Area */}
          <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: theme.palette.background.paper }}>
            <Typography variant="h6" fontWeight="600" mb={2}>
              Chat giao dịch
            </Typography>
            <Box sx={{ flex: 1, overflowY: "auto", mb: 2, pr: 1 }}>
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
                          maxWidth: "70%",
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