import React, { useState } from "react";
import "./chat.css"; // Optional CSS for styling

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, newMessage]);
            setNewMessage("");
        }
    };

    return (
        <div className='chatbox'>
            <h3>Chat</h3>
            <div className='messages'>
                {messages.map((msg, index) => (
                    <div key={index} className='message'>
                        {msg}
                    </div>
                ))}
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
