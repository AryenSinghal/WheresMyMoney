import React, { useState } from 'react';

function Chatbot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim() !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: userInput },
      ]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'chatbot', text: `You said: ${userInput}` },
      ]);
      setUserInput('');
    }
  };

  return (
    <div className="h-full p-4 flex flex-col justify-between">
      {/* Chat messages */}
      <div className="flex-1 overflow-auto mb-4">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white text-right'
                  : 'bg-gray-300 text-left'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>

      {/* Input field and send button */}
      <div className="flex items-center mt-2 mb-15">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-l-lg bg-white"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="
          bg-[#9B33E6] text-white p-2 ml-2 rounded-lg hover:bg-[#A64DFF] active:bg-[#B366FF]
"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
