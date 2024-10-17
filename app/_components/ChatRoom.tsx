"use client";
import { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { UserContext } from "../_providers/UserProvider";

interface MessageType {
  content: string;
  username: string;
}

export default function ChatRoom() {
  const user = useContext(UserContext);
  const { id: chatroomId } = useParams(); // Get the chatroom ID from URL
  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [message, setMessage] = useState<any>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!chatroomId) return;

    // Establish WebSocket connection
    const newSocket = new WebSocket(`wss://localhost:3001/chat/${chatroomId}`);
    setSocket(newSocket);

    newSocket.onerror = (error) => {
      console.log(error);
    };

    newSocket.onopen = () => {
      console.log("connected");
    };

    newSocket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    };

    return () => newSocket.close(); // Close socket when component unmounts
  }, [chatroomId]);

  const sendMessage = () => {
    if (socket) {
      socket.send(
        JSON.stringify({ content: message, username: user?.username })
      );
      setMessage(""); // Clear input field after sending
    }
  };

  return (
    <div>
      <h1>Chat Room: {chatroomId}</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{`${msg.username} - ${msg.content}`}</p>
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
