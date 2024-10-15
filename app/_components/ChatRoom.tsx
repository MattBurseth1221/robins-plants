"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ChatRoom() {
  const { id: chatroomId } = useParams(); // Get the chatroom ID from URL
  const [messages, setMessages] = useState<Array<any>>([]);
  const [message, setMessage] = useState<any>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    console.log("here");
    if (!chatroomId) return;
    console.log("here two");
    
    // Establish WebSocket connection
    const newSocket = new WebSocket(`ws://localhost:3000/api/chat/${chatroomId}`);
    setSocket(newSocket);

    newSocket.onerror = (error) => {
      console.log(error);
    }

    newSocket.onopen = () => {
      console.log("connected");
    }

    console.log("here again?");
    console.log(newSocket);

    newSocket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    };

    return () => newSocket.close(); // Close socket when component unmounts
  }, [chatroomId]);

  const sendMessage = () => {
    if (socket) {
      socket.send(JSON.stringify({ content: message }));
      setMessage(''); // Clear input field after sending
    }
  };

  return (
    <div>
      <h1>Chat Room: {chatroomId}</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.content}</p>
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

