import React, { useState, useRef } from "react";
import "./chat.css";

export default function Chat({ auctionName, chatStore, setChatStore }) {
    const messages = chatStore[auctionName] || [];
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const userMessage = `🧑 Bạn: ${newMessage}`;
            const botMessage = `🤖 Đối tác: Cảm ơn bạn đã gửi "${newMessage}"`;

            const updatedMessages = [...messages, userMessage];
            setChatStore({
                ...chatStore,
                [auctionName]: updatedMessages,
            });
            setNewMessage("");

            // Giả lập tin nhắn phản hồi sau 1 giây
            setTimeout(() => {
                const newMessages = [...updatedMessages, botMessage];
                setChatStore((prevStore) => ({
                    ...prevStore,
                    [auctionName]: newMessages,
                }));
            }, 1000);
        }
    };



    return (
        <div className="chatbox">
            <h3>Chat - {auctionName}</h3>
            <div className="messages">
                {messages.length === 0 ? (
                    <div className="no-messages">Chưa có tin nhắn nào</div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className="message">
                            {msg}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
