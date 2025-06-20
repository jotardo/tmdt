import { useEffect } from "react";

export default function StripeSuccess() {
    useEffect(() => {
        console.log("StripeSuccess loaded");

        if (window.opener) {
            console.log("Sending postMessage to opener...");
            window.opener.postMessage("stripe_payment_success", "*");
        } else {
            console.warn("Không tìm thấy window.opener");
        }

        const timer = setTimeout(() => {
            console.log("Closing window...");
            window.close();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <div style={{
            textAlign: "center",
            marginTop: "100px",
            fontFamily: "Arial, sans-serif"
        }}>
            <h2>🎉 Thanh toán thành công!</h2>
            <p>Đang chuyển hướng bạn về trang chính...</p>
        </div>
    );
}
