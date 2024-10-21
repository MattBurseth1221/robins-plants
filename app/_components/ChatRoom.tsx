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
  const { id: chatroomId } = useParams();
  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [message, setMessage] = useState<any>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [shouldShake, setShouldShake] = useState<boolean>(false);

  useEffect(() => {
    async function getMessages() {
      const messagesResult = await fetch(
        `/api/messages?display_id=${chatroomId}`
      ).then((res) => res.json());

      let pulledMessages = [];

      for (let i = 0; i < messagesResult.length; i++) {
        pulledMessages.push(messagesResult[i].message_data);
      }

      setMessages(pulledMessages);
    }

    getMessages();
  }, [chatroomId]);

  useEffect(() => {
    if (!chatroomId) return;

    async function doesChatExist() {
      const chatResult = await fetch(`/api/chat?display_id=${chatroomId}`).then(
        (res) => res.json()
      );

      if (chatResult.error) {
        console.log(chatResult.error);
        return;
        //not sure, return or redirect user out?
      }

      //otherwise, if chatResult has one row of data then the chat exists already
      if (chatResult.success.length !== 1) {
        const createChatResult = await createChat();
      }
    }

    doesChatExist();
  }, []);

  useEffect(() => {
    if (!chatroomId) return;

    //create new chat with chatroom id
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

      console.log(newMessage.content);
      console.log(message);

      if ((newMessage.content as string) === (message as string)) {
        console.log("true asf");
      }

      setMessages((prev) => [...prev, newMessage]);
    };

    return () => newSocket.close();
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

      setMessage("");
    }
  };

  async function createChat() {
    const createChatResult = await fetch(`/api/chat?display_id=${chatroomId}`, {
      method: "POST",
    }).then((res) => res.json());
    return createChatResult;
  }

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
