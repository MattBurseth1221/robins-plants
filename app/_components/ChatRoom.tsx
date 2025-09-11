"use client";
import { useState, useEffect, useContext, useCallback, useRef } from "react";
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

  const params = useParams();
  const chatroomId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [message, setMessage] = useState<string>("");
  const [shouldShake, setShouldShake] = useState<boolean>(false);
  const [typing, setTyping] = useState<Array<string>>([]);
  const [typingDebounce, setTypingDebounce] = useState<number>(Date.now());

  const socketRef = useRef<WebSocket | null>(null);

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

      const pulledMessages: MessageType[] = [];
      for (let i = 0; i < messagesResult.length; i++) {
        pulledMessages.push(messagesResult[i].message_data);
      }
      setMessages(pulledMessages);
    }

    if (chatroomId) getMessages();
  }, [chatroomId]);

  useEffect(() => {
    if (!chatroomId) return;

    async function doesChatExist() {
      const chatResult = await fetch(`/api/chat?display_id=${chatroomId}`).then(
        (res) => res.json()
      );

      if (chatResult?.error) {
        console.log(chatResult.error);
        return;
      }

      if ((chatResult?.success?.length ?? 0) !== 1) {
        await createChat();
      }
    }

    doesChatExist();
  }, [chatroomId, createChat]);

  useEffect(() => {
    if (!chatroomId) return;

    const ws = new WebSocket(`wss://ws.robinplants.com/chat/${chatroomId}`);
    socketRef.current = ws;

    ws.onerror = (error) => console.log(error);
    ws.onopen = () => console.log("connected");

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);

      if (newMessage.typing === true) {
        setTyping((prev) =>
          prev.includes(newMessage.username) ? prev : [...prev, newMessage.username]
        );
        return;
      } else if (newMessage.typing === false) {
        setTyping((prev) => prev.filter((typer) => typer !== newMessage.username));
        return;
      }

      setMessages((prev) => [...prev, newMessage]);
    };

    return () => {
      try { ws.close(); } catch {}
      socketRef.current = null;
    };
  }, [chatroomId]);

  const sendMessage = async () => {
    if (!message || message.length === 0) {
      setShouldShake(true);
      setMessage("");
      setTimeout(() => setShouldShake(false), 250);
      return;
    }

    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ content: message, username: user?.username }));
    }

    const messageResult = await fetch(
      `/api/messages?display_id=${chatroomId}`,
      {
        method: "POST",
        body: JSON.stringify({ content: message, username: user?.username }),
      }
    ).then((res) => res.json());

    if (messageResult?.error) {
      console.log(messageResult.error);
      alert("Message failed to post");
    }

    setMessage("");
  };

  async function adjustTypeTime() {
    setTypingDebounce(Date.now());

    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ typing: true, username: user?.username }));
    }

    setTimeout(() => {
      if (Date.now() >= typingDebounce + 5000) {
        const ws2 = socketRef.current;
        if (ws2 && ws2.readyState === WebSocket.OPEN) {
          ws2.send(JSON.stringify({ typing: false, username: user?.username }));
        }
      }
    }, 3000);
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
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.username === user?.username;
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const isConsecutiveFromSameUser =
            prevMessage && prevMessage.username === msg.username;

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
                } mt-1`}
              >
                <p className="text-sm break-words break-all">{msg.content}</p>
              </div>
            </div>
          </div>
        );})}

        {/* Typing Indicator */}
        {typing.filter((typer) => typer !== user?.username).length > 0 && (
          <div className="flex justify-start mt-1">
            <div className="bg-background border border-border px-4 py-2 rounded-2xl">
              <p className="text-sm text-muted">
                {typing
                  .filter((typer) => typer !== user?.username)
                  .join(", ")}{" "}
                {typing.filter((typer) => typer !== user?.username).length === 1
                  ? "is"
                  : "are"}{" "}
                typing...
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
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
