import React, { useState, useEffect, useRef } from 'react';

function Chatbot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'chatbot', text: 'Hi! I\'m your financial assistant. I can analyze your spending patterns and suggest specific ways to save money. What would you like to know?' }
  ]);
  
  const suggestedQuestions = [
    "What are cheaper alternatives to my frequent purchases?",
    "Which recurring expenses should I consider cutting?",
    "Where am I overspending the most?",
    "How can I reduce my dining expenses?",
    "What specific changes can I make to save more?"
  ];
  
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() !== '' && !isLoading) {
      // Add user message
      const userMessage = { sender: 'user', text: userInput };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setUserInput('');
      setIsLoading(true);

      try {
        // Call the chatbot API with conversation history
        const response = await fetch('http://localhost:5001/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: userInput,
            history: updatedMessages
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Add bot response
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'chatbot', text: data.response },
          ]);
        } else {
          // Handle error
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'chatbot', text: 'Sorry, I encountered an error. Please try again.' },
          ]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'chatbot', text: 'Sorry, I couldn\'t connect to the server. Please try again later.' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full p-4 flex flex-col justify-between">
      {/* Suggested questions */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className="text-sm text-white/70 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setUserInput(question);
                }}
                className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1 rounded-full border border-white/20"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Chat messages */}
      <div className="flex-1 overflow-auto mb-4">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[85%] ${
                message.sender === 'user'
                  ? 'bg-[#9B33E6] text-white ml-auto'
                  : 'bg-white/20 text-white mr-auto'
              }`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && (
            <div className="bg-white/20 text-white p-3 rounded-lg mr-auto max-w-[85%]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input field and send button */}
      <div className="flex items-center mt-2 mb-15">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full p-2 border rounded-l-lg bg-white"
          placeholder="Ask about specific ways to save money..."
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className={`bg-[#9B33E6] text-white p-2 ml-2 rounded-lg 
            ${isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-[#A64DFF] active:bg-[#B366FF]'
            }`}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;