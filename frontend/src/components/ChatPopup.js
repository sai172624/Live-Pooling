import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const ChatPopup = ({ isOpen, onToggle, onSendMessage, senderName }) => {
  const { messages } = useSelector(state => state.chat);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <h3 className="chat-title">Chat</h3>
        <button className="close-chat" onClick={onToggle}>
          ✕
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p style={{ 
            textAlign: 'center', 
            color: '#718096', 
            fontStyle: 'italic',
            marginTop: '2rem'
          }}>
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="chat-message">
              <div className="message-sender">
                {msg.senderName}
              </div>
              <div className="message-text">
                {msg.message}
              </div>
              <div className="message-time">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          autoFocus
        />
        <button type="submit" className="chat-send">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPopup;
