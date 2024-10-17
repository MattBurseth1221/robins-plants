"use client";
import { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { UserContext } from "../_providers/UserProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

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
  const [shouldShake, setShouldShake] = useState<boolean>(false);

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
    if (!message || message.length === 0) {
      setShouldShake(true);

      setTimeout(() => {
        setShouldShake(false);
      }, 250);
      return;
    }

    if (socket) {
      socket.send(
        JSON.stringify({ content: message, username: user?.username })
      );
      setMessage(""); // Clear input field after sending
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl mb-4">Chat Room: {chatroomId}</h1>
      <div className="bottom-24 fixed max-w-[35%] min-w-[35%] flex flex-col">
        <div className="">
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col`}>
              <div
                className={`mb-2 p-2 max-w-[60%] bg-slate-100 rounded-md inline-block text-wrap break-all ${
                  msg.username === user?.username
                    ? "ml-auto text-right"
                    : "mr-auto text-left"
                }`}
              >
                <p className="text-sm">{`${msg.username}`}</p>
                <p className="text-md ">{`${msg.content}`}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <form
            id="comment-form"
            action={sendMessage}
            className="flex justify-center items-center mt-4"
          >
            <textarea
              placeholder={"Send a message..."}
              rows={1}
              className="bg-gray-300 w-[100%] p-1 pl-2 rounded-xl box-content border-none max-h-[30vh]"
              name="comment_body"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button
              className="hover:bg-gray-300 transition rounded-md p-1 ml-2 mb-4"
              type="submit"
            >
              <FontAwesomeIcon icon={faPaperPlane} shake={shouldShake} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
