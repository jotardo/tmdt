import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Dialog, DialogTitle, DialogContent, TextField, Box } from "@mui/material";

function AuctionRegistrationForm({ open, onClose, productId }) {
  const [formData, setFormData] = useState({
    bidderName: "",
    contactNumber: "",
    bidAmount: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement auction registration logic here
    toast.success("Đăng ký đấu giá thành công!");
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Đăng ký đấu giá</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Họ và tên"
            name="bidderName"
            value={formData.bidderName}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Số điện thoại"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Số tiền đấu giá (VNĐ)"
            name="bidAmount"
            type="number"
            value={formData.bidAmount}
            onChange={handleChange}
            required
            fullWidth
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              Đăng ký
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AuctionRegistrationForm;