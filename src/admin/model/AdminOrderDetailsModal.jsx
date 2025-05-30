import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Card,
} from "@mui/material";
import userApi from "../../backend/db/userApi";
import orderApi from "../../backend/db/orderApi";
import { toast } from "react-toastify";

/** onType = {detail, update} */
const OrderDetailModal = ({ open, onClose, onType, orderID, onRefetch }) => {

  const [orderDetail, setOrderDetail] = useState({});
  const [sendStatus, setSendStatus] = useState("");

  // Upon login, request a get info request to set user
  // Since this works using promise, setUser is set here
  const requestOrderDetails = (order_id) => {
    orderApi.fetchOrderDetails(order_id).then(orderDetails => {
      console.log("EHrm", orderDetails)
      setOrderDetail(orderDetails.data.order)
    });
  }
  const {
    id,
    receiverName,
    deliveryAddress,
    items,
    status,
    totalPrice,
  } = orderDetail;

  const orderStatus = {
    "PENDING": {name: "Chờ xác nhận", color: "info"},
    "CONFIRM": {name: "Đã xác nhận", color: "success"},
    "CANCELLLED": {name: "Đã hủy", color: "error"},
    "PAID": {name: "Đã thanh toán", color: "warning"}
  }

  useEffect(() => {
    if (open)
      requestOrderDetails(orderID)
  }, [open, orderID])

  const handleSubmit = async () => {
    try {
      const response = await orderApi.updateOrderStatus(orderID, sendStatus);
      if (response.data?.success) {
        toast.success("Cập nhật trạng thái thành công!");
        onClose(); // Đóng modal
      } else {
        toast.error("Cập nhật trạng thái thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
    } finally {
        onRefetch(); // Gọi callback để refetch
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {onType == "update" && "Cập nhật "}Thông tin đơn hàng
      </DialogTitle>
      <DialogContent>
        <Grid container >
          <Grid size={6}>
            <h4>Thông tin đơn hàng</h4>
            <h5>
              Mã đơn hàng : <small>{id}</small>
            </h5>
            <p>Tổng tiền thanh toán: {totalPrice} VNĐ</p>
            <p>Phương thức thanh toán : { }</p>
            <p>Ngày giao hàng : { }</p>
            Địa chỉ giao hàng
            {deliveryAddress && <div key={id} className="addressContainer">
              <div className="addressText">
                <p className="addType">
                  <small>
                    {!deliveryAddress.workAddress ? "Cá nhân" : "Văn phòng"}
                  </small>
                </p>
                <p>
                  <b>
                    {deliveryAddress.receiverName}
                    <span style={{ width: "20px" }}> ... </span>
                    {deliveryAddress.contactNumber}
                  </b>
                </p>
                <p>Số nhà: {deliveryAddress.buildingName}</p>
                {/* <p>{streetName}</p> */}
                <p>
                  {deliveryAddress.wardName}, {deliveryAddress.districtName}
                </p>
                <p>
                  {deliveryAddress.provinceName} - <b>{ }</b>
                </p>
              </div>
            </div>}
          </Grid>
          <Grid size={6}>
            <p>Chi tiết đơn hàng</p>
            <Box overflow="auto">
              {
                items && items.map((item) => (
              <Card sx={{ display: 'flex', width: '100%', maxWidth: 800, p: 2 }}>
                {/* Image Placeholder */}
                <Box
                  sx={{
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #000',
                    mr: 2,
                  }}
                >
                  <img src={`http://localhost:8080/api/product/${item.productImageUrl}`} width={80} height={80} />
                </Box>

                {/* Product Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{item.productName}</Typography>
                  <Typography variant="body1">x{item.quantity}</Typography>
                  <Typography variant="body2">Đơn giá: {item.price}đ VNĐ</Typography>
                </Box>
              </Card>
                ))
              }
            </Box>
            <Box>
              <FormControl disabled={onType !== "update"}>
                
              <p>Trạng thái đơn hàng:</p>
              <Select   
                label="Trạng thái"
                value={status ? status : ""}
                >
                {
                  Object.keys(orderStatus).map(statusName => (<MenuItem value={statusName}>
                    {orderStatus[statusName].name}
                  </MenuItem>))
                }
              </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{onType === "detail" ? "OK" : "Hủy"}</Button>
        { onType === "update" &&
        <Button onClick={handleSubmit} variant="contained">
          Cập nhật
        </Button>}
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailModal;
