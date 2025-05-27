import React, { useEffect, useState, useRef } from "react";

const OTPModal = ({ isOpen, onClose, onSubmit, onResend }) => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 phút = 300 giây
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCountdown(300);
      setOtp("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => clearTimeout(timerRef.current);
  }, [countdown, isOpen]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleResendClick = () => {
    if (onResend) {
      onResend();
      setCountdown(300); // reset đếm ngược lại 5 phút
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Nhập mã OTP</h2>
          <input
              type="text"
              className="w-full border rounded p-2 mb-4"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
          />
          <div className="flex justify-between items-center mb-4">
            {countdown > 0 ? (
                <p className="text-gray-600">
                  Gửi lại OTP sau: <b>{formatTime(countdown)}</b>
                </p>
            ) : (
                <button
                    onClick={handleResendClick}
                    className="text-blue-500 underline hover:text-blue-700"
                >
                  Gửi lại OTP
                </button>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Huỷ
            </button>
            <button
                onClick={() => onSubmit(otp)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
  );
};

export default OTPModal;
