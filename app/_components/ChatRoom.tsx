"use client";
import { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "next/navigation";
import { UserContext } from "../_providers/UserProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { setSourceMapsEnabled } from "process";

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
  const [typing, setTyping] = useState<Array<string>>([]);
  const [typingDebounce, setTypingDebounce] = useState<number>(Date.now());
  const [sentTyping, setSentTyping] = useState<boolean>(false);

  const createChat = useCallback(async () => {
    const createChatResult = await fetch(`/api/chat?display_id=${chatroomId}`, {
      method: "POST",
    }).then((res) => res.json());
    return createChatResult;
  }, [chatroomId]);

  useEffect(() => {
    async function getMessages() {
      const messagesResult = await fetch(
        `/api/messages?display_id=${chatroomId}`
      )
        .then((res) => res.json())
        .then((res) => res.success);

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
  }, [chatroomId, createChat]);

  useEffect(() => {
    if (!chatroomId) return;

    //create new chat with chatroom id
    const newSocket = new WebSocket(`wss://ws.robinplants.com/chat/${chatroomId}`);
    setSocket(newSocket);

    newSocket.onerror = (error) => {
      console.log(error);
    };

    newSocket.onopen = () => {
      console.log("connected");
    };

    newSocket.onmessage = (event) => {
      console.log("new incoming");
      const newMessage = JSON.parse(event.data);
      console.log(newMessage);

      if (newMessage.typing === true) {
        console.log("its true");
        setTyping([...typing, newMessage.username]);
        return;
      } else if (newMessage.typing === false) {
        console.log("false");
        setTyping(typing.filter((typer) => typer === newMessage.username));
        return;
      }

      console.log(newMessage.content);
      console.log(message);

      if ((newMessage.content as string) === (message as string)) {
        console.log("true asf");
      }

      setMessages((prev) => [...prev, newMessage]);
    };

    return () => newSocket.close();
  }, [chatroomId, message, typing]);

  const sendMessage = async () => {
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

      console.log("chat room id is " + chatroomId);

      const messageResult = await fetch(
        `/api/messages?display_id=${chatroomId}`,
        {
          method: "POST",
          body: JSON.stringify({ content: message, username: user?.username }),
        }
      ).then((res) => res.json());

      if (messageResult.error) {
        console.log(messageResult.error);
        alert("Message failed to post");
      } else if (messageResult.success) {
        console.log(messageResult.success);
      }

      setMessage("");
    }
  };

  async function adjustTypeTime() {
    setTypingDebounce(Date.now());

    if (socket) {
      socket.send(JSON.stringify({ typing: true, username: user?.username }));
    }

    setTimeout(() => {
      if (Date.now() >= typingDebounce + 5000) {
        if (socket) {
          socket.send(JSON.stringify({ typing: false, username: user?.username }));
        }
      }
    }, 3000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-bold text-text">Chat Room: {chatroomId}</h1>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full"></div>
          <span className="text-muted text-sm">Online</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.username === user?.username;
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const isConsecutiveFromSameUser = prevMessage && prevMessage.username === msg.username;
          
          return (
            <div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col max-w-xs ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                {!isCurrentUser && !isConsecutiveFromSameUser && (
                  <span className="text-xs text-muted mb-1">{msg.username}</span>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isCurrentUser
                      ? "bg-primary text-white"
                      : "bg-background border border-border text-text"
                  } ${isCurrentUser && isConsecutiveFromSameUser ? 'mt-1' : ''}`}
                >
                  <p className="text-sm break-words break-all">{msg.content}</p>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Typing Indicator */}
        {typing.filter((typer) => typer !== user?.username).length > 0 && (
          <div className="flex justify-start">
            <div className="bg-background border border-border px-4 py-2 rounded-2xl">
              <p className="text-sm text-muted">
                {typing.filter((typer) => typer !== user?.username).join(', ')} {typing.filter((typer) => typer !== user?.username).length === 1 ? 'is' : 'are'} typing...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-end space-x-3"
        >
          <input
            placeholder="Send a message..."
            autoComplete="off"
            className="flex-1 p-3 border border-border rounded-xl bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTypeTime();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            type="submit"
            className="bg-primary text-white p-3 rounded-xl hover:bg-primaryDark transition focus:outline-none focus:ring-2 focus:ring-primary/20 flex-shrink-0"
          >
            <FontAwesomeIcon icon={faPaperPlane} shake={shouldShake} />
          </button>
        </form>
      </div>
    </div>
  );
}
