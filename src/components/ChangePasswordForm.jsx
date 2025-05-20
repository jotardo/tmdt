import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import authApi from '../backend/db/authApi';

export default function ChangePasswordForm({ setIsOpenChangePassword, userId }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.info('❌ Mật khẩu mới không khớp!');
      return;
    }

    try {
      const payload = {
        userId,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      console.log("Paylod ", payload);

      await authApi.changePassword(payload);
      toast.success('✅ Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setIsOpenChangePassword(false); // Đóng popup sau khi đổi thành công
    
    } catch (error) {
      toast.info(`❌ Đổi mật khẩu thất bại`);
    }
  };

  // Đóng popup khi click ra ngoài modal
  const handleClose = (e) => {
    if (e.target.id === 'overlay') {
      setIsOpenChangePassword(false);
    }
  };

  return (
    <div
      id="overlay"
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <form
        onSubmit={handleChangePassword}
        style={{
          backgroundColor: '#f9f9f9',
          padding: 20,
          borderRadius: 10,
          maxWidth: 400,
          width: '90%',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <h3 style={{ marginBottom: 20, color: '#333' }}>🔒 Đổi mật khẩu</h3>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, currentPassword: e.target.value })
            }
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>
            Mật khẩu mới
          </label>
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            value={passwordData.confirmNewPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
            }
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ✅ Xác nhận
        </button>
      </form>
    </div>
  );
};