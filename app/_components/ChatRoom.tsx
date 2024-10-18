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
      setMessage("");

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
    <>
      <h1 className="text-xl mb-4">Chat Room: {chatroomId}</h1>
      <div className="fixed bottom-12 justify-end max-w-[35%] min-w-[35%] flex flex-col px-2">
        <div className="max-h-[70vh] overflow-y-scroll snap-start">
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col px-4`}>
              <div
                className={`mb-2 p-2 max-w-[60%] bg-slate-100 rounded-md inline-block text-wrap break-words ${
                  msg.username === user?.username
                    ? "ml-auto text-left"
                    : "mr-auto text-left"
                }`}
              >
                {msg.username !== user?.username && (
                  <p className="text-xs">{`${msg.username}`}</p>
                )}
                <p className="text-md ">{`${msg.content}`}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="">
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
    </>
  );
}
