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
    <div className="h-full flex flex-col">
      {/* Suggested questions */}
      {messages.length === 1 && (
        <div className="mb-4 px-4">
          <p className="text-sm text-white/50 mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setUserInput(question);
                }}
                className="bg-white/5 hover:bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/10 transition-all duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Chat messages */}
      <div className="flex-1 overflow-auto px-4 mb-4">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-2xl max-w-[85%] ${
                message.sender === 'user'
                  ? 'bg-purple-500/20 text-white ml-auto'
                  : 'bg-white/5 text-white/90 mr-auto'
              }`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && (
            <div className="bg-white/5 text-white/90 p-3 rounded-2xl mr-auto max-w-[85%]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input field and send button */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
            placeholder="Ask about your finances..."
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className={`p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 active:bg-purple-700 transition-all duration-200 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;