import React, { useState } from 'react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border rounded flex-1 p-2"
        placeholder="Type a message..."
      />
      <button type="submit" className="bg-blue-500 text-white rounded p-2">Send</button>
    </form>
  );
};

export default InputArea;
