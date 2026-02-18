import React, { useState, useRef, useEffect, type KeyboardEvent } from "react";
import "./Chat.css";

type MessageType = "user" | "ai";

interface Message {
  id: number;
  type: MessageType;
  text: string;
}

export interface ChatProps {
    sendUserMessage: (message: string) => void;
    aiReply: string;
}


export default function Chat({sendUserMessage, aiReply}: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);
    
    const sendMessage = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const newMessage: Message = {
            id: Date.now(),
            type: "user",
            text: trimmed,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setIsTyping(true);

        sendUserMessage(trimmed);
    };

    useEffect(() => {
        if (!aiReply || !aiReply.trim()) return;

        
        // backend bot reply
        setTimeout(() => {
        setIsTyping(false);
        const aiResponse: Message = {
            id: Date.now() + 1,
            type: "ai",
            text: aiReply,
        };
        setMessages((prev) => [...prev, aiResponse]);
        }, 1500);

    }, [aiReply])

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setIsTyping(false);
    };

    return (
    <div className="ai-consultant">
        <div className="consultant-header"> 
            AI Consultant 
            <button onClick={clearChat} className="clear-chat-btn">Clear</button>
        </div>
        <div className="chat-messages" id="chatMessages">
            {messages.length === 0 && !isTyping && (
            <div className="chat-placeholder">
                <div className="chat-placeholder-icon">💬</div>
                <div>Ask for hints or tactical advice</div>
            </div>
            )}

            {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
                <div className={`message-avatar ${msg.type}`}>
                {msg.type === "ai" ? "🤖" : "👤"}
                </div>
                <div className="message-bubble">{msg.text}</div>
            </div>
            ))}

            {isTyping && (
            <div className="message ai typing">
                <div className="message-avatar ai">🤖</div>
                <div className="message-bubble">
                <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                </div>
                </div>
            </div>
            )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask a question..."
        />
        <button onClick={sendMessage} className="chat-send-btn">
          Send
        </button>
        
      </div>
    </div>
    );
};

