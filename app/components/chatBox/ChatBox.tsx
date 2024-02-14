import React from 'react';
import Message from '../message/Message';

interface ChatBoxProps {
  messages: Array<{ id: string; author: string; message: string; timestamp: Date; }>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => (
  <div className="h-96 overflow-y-scroll flex flex-col gap-2 p-4">
    {messages.map((msg) => (
      <Message key={msg.id} author={msg.author} message={msg.message} timestamp={msg.timestamp} />
    ))}
  </div>
);

export default ChatBox;
