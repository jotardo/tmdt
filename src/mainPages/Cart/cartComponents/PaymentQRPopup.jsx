import { useEffect } from "react";

export function PaymentQR({ url, onClose }) {
    useEffect(() => {
        if (url) {
            const stripeWindow = window.open(url, "_blank", "width=600,height=800");

            const checkClosed = setInterval(() => {
                if (stripeWindow && stripeWindow.closed) {
                    clearInterval(checkClosed);
                    onClose(); // hoặc bạn có thể reload trạng thái đơn hàng tại đây
                }
            }, 500);
        }
    }, [url]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl relative w-96 text-center">
                <p className="font-semibold text-lg mb-2">Đang mở thanh toán Stripe...</p>
                <p>Bạn vui lòng hoàn tất thanh toán trong cửa sổ mới.</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
}
