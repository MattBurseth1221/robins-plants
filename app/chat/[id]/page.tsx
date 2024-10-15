'use client';

import MainNav from "@/app/_components/MainNav";
import PageTitle from "@/app/_components/PageTitle";
import ProfileBar from "@/app/_components/ProfileBar";
import UserProvider, { UserContext } from "@/app/_providers/UserProvider";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default async function Chat() {
  const user = useContext(UserContext);
  const { id: chatroomId } = useParams();
  const [messages, setMessages] = useState<any>([]);
  const [message, setMessage] = useState<any>('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    setSocket(new WebSocket(`ws://localhost:3000/api/chat/${chatroomId}`));

    socket.onmessage = (event: any) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev: any) => [...prev, newMessage]);
    };

    return () => socket.close();
  }, [chatroomId]);

  const sendMessage = () => {
    socket.send(JSON.stringify({ content: message }));
    setMessage('');
  };

  return (
    <UserProvider user={user}>
      <main className="flex min-h-screen">
        <MainNav active={"Home"} />

        <div className="p-10 flex flex-col text-center w-[60%] mx-auto items-center">
          <PageTitle title="- Messaging -" />

          <div>
            <h1>Chat Room: {chatroomId}</h1>
            <div>
              {messages.map((msg: any, index: number) => (
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

          {/* <Suspense fallback={<div>Loading posts...</div>}>
              
            </Suspense> */}
        </div>

        <ProfileBar />

        {/* <div className="w-[50%] h-32 bg-gradient-to-b from-lg to-dg"></div>
        <div className="w-[50%] h-32 bg-gradient-to-b from-dg to-lb"></div>
        <div className="w-[50%] h-32 bg-gradient-to-b from-lb to-db"></div>
        <div className="w-[50%] h-32 bg-db"></div> */}

        {/* <div className="w-[50%] h-32">{JSON.stringify(user)};</div> */}
      </main>
    </UserProvider>
  );
}
