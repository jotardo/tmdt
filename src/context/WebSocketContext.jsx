import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [connected, setConnected] = useState(false);
    // Dùng useRef để giữ instance của client, nhưng không khởi tạo nó ở đây
    const stompClientRef = useRef(null);

    useEffect(() => {
        // Chỉ tạo client nếu nó chưa tồn tại
        if (!stompClientRef.current) {
            const client = new Client({
                webSocketFactory: () => new SockJS(`${process.env.REACT_APP_BASE_URL}/ws/reverse-auction`),
                onConnect: () => {
                    setConnected(true);
                    console.log("Connected to WebSocket");
                },
                onDisconnect: () => {
                    setConnected(false);
                    console.log("Disconnected from WebSocket");
                },
                // THÊM CẤU HÌNH RECONNECT VÀ HEART-BEAT (xem mục 2)
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                debug: (str) => {
                    console.log(new Date(), str);
                },
            });

            stompClientRef.current = client;
        }

        // Kích hoạt client. Nếu đã active, nó sẽ không làm gì cả.
        stompClientRef.current.activate();

        // Hàm dọn dẹp sẽ deactivate client khi Provider unmount
        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.deactivate();
            }
        };
    }, []); // useEffect vẫn chỉ chạy một lần

    const sendMessage = (destination, body) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.publish({ destination, body: JSON.stringify(body) });
        }
    };

    const subscribe = (destination, callback) => {
        if (stompClientRef.current) {
             // Không cần đợi connected, subscribe sẽ được kích hoạt lại khi kết nối lại
            return stompClientRef.current.subscribe(destination, (message) => {
                callback(JSON.parse(message.body));
            });
        }
    };

    return (
        <WebSocketContext.Provider value={{ connected, sendMessage, subscribe }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);