import React from 'react';

interface MessageProps {
  author: string;
  message: string;
  timestamp: Date;
}

const Message: React.FC<MessageProps> = ({ author, message, timestamp }) => (
  <div className="border rounded-lg p-2">
    <p className="text-sm">{message}</p>
    <div className="text-xs text-gray-500">
      {author}, {timestamp.toLocaleTimeString()}
    </div>
  </div>
);

export default Message;
