import React, { useRef, useState, useEffect } from 'react';
import { Sun, Moon, Rocket, Globe } from 'lucide-react';
import LeftSpaceAnimation from './components/LeftSpaceAnimation';
import RightSpaceAnimation from './components/RightSpaceAnimation';

const initialMessages = [
  { sender: 'bot', text: 'Hello! I\'m your MOSDAC AI Assistant. How can I help you navigate satellite data, documentation, or find specific information from our knowledge graph?' },
];

// Enhanced 3D Space Background Component
function SpaceBackground({ theme }) {
  const satelliteRef = useRef();
  const planetRef = useRef();
  const starsRef = useRef();
  const asteroidRef = useRef();
  const rocketRef = useRef();
  const spaceStationRef = useRef();
  const isroSatRef = useRef();

  useEffect(() => {
    // Simple CSS animations for space objects
    const animateObjects = () => {
      // Rotate satellites
      if (satelliteRef.current) {
        satelliteRef.current.style.animation = 'rotate 15s linear infinite';
      }
      if (isroSatRef.current) {
        isroSatRef.current.style.animation = 'rotate 20s linear infinite reverse';
      }
      if (planetRef.current) {
        planetRef.current.style.animation = 'rotate 25s linear infinite';
      }
      if (spaceStationRef.current) {
        spaceStationRef.current.style.animation = 'float 6s ease-in-out infinite';
      }
      if (rocketRef.current) {
        rocketRef.current.style.animation = 'rocket-launch 12s ease-in-out infinite';
      }
    };

    animateObjects();
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100'
      }`} />
      
      <svg width="100%" height="100%" viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
        {/* Stars */}
        <g ref={starsRef}>
          {[...Array(50)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1200}
              cy={Math.random() * 800}
              r={Math.random() * 2 + 0.5}
              fill={theme === 'dark' ? "#fbbf24" : "#1e40af"}
              opacity={Math.random() * 0.8 + 0.2}
              className="animate-pulse"
            />
          ))}
        </g>

        {/* Left side - ISRO Satellite */}
        <g ref={isroSatRef} transform="translate(150, 200)">
          <rect x="0" y="0" width="40" height="25" fill={theme === 'dark' ? "#1e40af" : "#3b82f6"} stroke="#60a5fa" strokeWidth="2" rx="5" />
          <rect x="-20" y="5" width="15" height="15" fill={theme === 'dark' ? "#0f172a" : "#1e293b"} stroke="#f59e0b" strokeWidth="1" />
          <rect x="45" y="5" width="15" height="15" fill={theme === 'dark' ? "#0f172a" : "#1e293b"} stroke="#f59e0b" strokeWidth="1" />
          <line x1="20" y1="0" x2="20" y2="-15" stroke="#ffd700" strokeWidth="2" />
          <circle cx="20" cy="-18" r="4" fill="#f59e0b" />
          <text x="20" y="15" textAnchor="middle" fill="#ffd700" fontSize="6" fontWeight="bold">ISRO</text>
        </g>

        {/* Right side - Space Station */}
        <g ref={spaceStationRef} transform="translate(1000, 150)">
          <circle cx="0" cy="0" r="25" fill={theme === 'dark' ? "#1e40af" : "#3b82f6"} stroke="#60a5fa" strokeWidth="2" />
          <rect x="-40" y="-5" width="80" height="10" fill={theme === 'dark' ? "#0f172a" : "#1e293b"} stroke="#f59e0b" strokeWidth="1" />
          <rect x="-5" y="-40" width="10" height="80" fill={theme === 'dark' ? "#0f172a" : "#1e293b"} stroke="#f59e0b" strokeWidth="1" />
          <rect x="-70" y="-15" width="25" height="30" fill={theme === 'dark' ? "#0f172a" : "#1e293b"} stroke="#60a5fa" strokeWidth="1" />
          <rect x="45" y="-15" width="25" height="30" fill={theme === 'dark' ? "#0f172a" : "#1e293b"} stroke="#60a5fa" strokeWidth="1" />
          <line x1="0" y1="-25" x2="0" y2="-45" stroke="#ffd700" strokeWidth="2" />
          <polygon points="0,-45 -5,-40 5,-40" fill="#f59e0b" />
        </g>

        {/* Planet */}
        <g ref={planetRef} transform="translate(950, 600)">
          <circle cx="0" cy="0" r="60" fill={theme === 'dark' ? "#f59e0b" : "#dc2626"} opacity="0.8" />
          <circle cx="0" cy="0" r="65" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.6" />
          <circle cx="-20" cy="-20" r="8" fill={theme === 'dark' ? "#d97706" : "#b91c1c"} opacity="0.7" />
          <circle cx="20" cy="20" r="12" fill={theme === 'dark' ? "#92400e" : "#991b1b"} opacity="0.5" />
        </g>

        {/* Satellite in orbit */}
        <g ref={satelliteRef} transform="translate(300, 300)">
          <rect x="0" y="0" width="35" height="20" fill={theme === 'dark' ? "#1e40af" : "#3b82f6"} stroke="#60a5fa" strokeWidth="2" rx="3" />
          <rect x="-15" y="2" width="12" height="16" fill={theme === 'dark' ? "#0f172a" : "#1e293b"} stroke="#f59e0b" strokeWidth="1" />
          <rect x="38" y="2" width="12" height="16" fill={theme === 'dark' ? "#0f172a" : "#1e293b"} stroke="#f59e0b" strokeWidth="1" />
          <line x1="17" y1="0" x2="17" y2="-20" stroke="#ffd700" strokeWidth="2" />
          <circle cx="17" cy="-23" r="3" fill="#f59e0b" />
        </g>

        {/* Rocket */}
        <g ref={rocketRef} transform="translate(50, 600)">
          <rect x="0" y="0" width="16" height="45" fill={theme === 'dark' ? "#dc2626" : "#ef4444"} rx="8" />
          <polygon points="8,0 0,-15 16,-15" fill="#ffd700" />
          <polygon points="0,40 -5,50 5,45" fill="#b91c1c" />
          <polygon points="16,40 21,50 11,45" fill="#b91c1c" />
          <rect x="4" y="45" width="8" height="8" fill="#374151" />
          <polygon points="8,53 4,65 12,65" fill="#f59e0b" opacity="0.8" />
          <text x="8" y="25" textAnchor="middle" fill="#ffffff" fontSize="4" fontWeight="bold">ISRO</text>
        </g>

        {/* Asteroids */}
        <g ref={asteroidRef}>
          <circle cx="100" cy="500" r="12" fill={theme === 'dark' ? "#78716c" : "#a8a29e"} opacity="0.8" className="animate-pulse" />
          <circle cx="1100" cy="200" r="18" fill={theme === 'dark' ? "#a8a29e" : "#78716c"} opacity="0.7" className="animate-pulse" />
          <circle cx="400" cy="100" r="8" fill={theme === 'dark' ? "#78716c" : "#a8a29e"} opacity="0.9" className="animate-pulse" />
        </g>
      </svg>

      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes rocket-launch {
          0% { transform: translateY(0px); }
          25% { transform: translateY(-100px) translateX(50px); }
          50% { transform: translateY(-200px) translateX(100px); }
          75% { transform: translateY(-300px) translateX(150px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
      `}</style>
    </div>
  );
}

// Enhanced Chatbot Component
function Chatbot({ theme }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsTyping(true);

    // Enhanced bot responses for MOSDAC
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        `Searching MOSDAC knowledge graph for "${userMessage}". Found relevant satellite data and documentation from our portal.`,
        `Analyzing your query about "${userMessage}". I'm processing geospatial data and related FAQs from www.mosdac.gov.in.`,
        `Great question about "${userMessage}"! Let me retrieve the most relevant information from our satellite mission database and product specifications.`,
        `Processing "${userMessage}" through our AI system. I'm accessing static and dynamic web content including PDFs, documentation, and meta tags.`,
        `Your query on "${userMessage}" is being matched against our knowledge graph. I can help you find specific product catalogues, scientific articles, and support materials.`
      ];
      
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: responses[Math.floor(Math.random() * responses.length)]
      }]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className={`${
        theme === 'dark' 
          ? 'bg-slate-800/90 border-blue-500/40' 
          : 'bg-white/90 border-blue-300/40'
      } backdrop-blur-xl border rounded-3xl shadow-2xl p-8 flex flex-col h-[700px] relative overflow-hidden transition-all duration-300`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-blue-500/30 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-14 h-14 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-blue-600 via-orange-500 to-blue-600' 
                  : 'bg-gradient-to-br from-blue-500 via-orange-400 to-blue-500'
              } rounded-full flex items-center justify-center animate-pulse`}>
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className={`${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              } font-bold text-xl`}>MOSDAC AI Assistant</h3>
              <p className={`${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              } text-sm`}>Knowledge Graph Information Retrieval</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              } text-sm`}>Online</span>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-500 text-xs rounded-full border border-blue-500/30">
              NLP/ML Mode
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 relative z-10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-6 py-4 rounded-2xl max-w-[80%] text-sm shadow-lg transition-all duration-300 relative
                  ${msg.sender === 'user'
                    ? `${theme === 'dark' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      } rounded-br-md`
                    : `${theme === 'dark' 
                        ? 'bg-slate-700/60 text-white border border-blue-500/20' 
                        : 'bg-white/80 text-slate-800 border border-blue-300/20'
                      } rounded-bl-md backdrop-blur-sm`}
                `}
              >
                {msg.sender === 'bot' && (
                  <div className="absolute -left-2 top-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className={`${
                theme === 'dark' 
                  ? 'bg-slate-700/60 text-white border border-blue-500/20' 
                  : 'bg-white/80 text-slate-800 border border-blue-300/20'
              } px-6 py-4 rounded-2xl rounded-bl-md backdrop-blur-sm relative`}>
                <div className="absolute -left-2 top-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className={`${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  } text-xs`}>AI is processing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-4 relative z-10">
          <div className="flex-1 relative">
            <input
              className={`w-full px-6 py-4 rounded-full ${
                theme === 'dark' 
                  ? 'bg-slate-700/80 text-white placeholder-slate-400 border-blue-500/30' 
                  : 'bg-white/80 text-slate-800 placeholder-slate-500 border-blue-300/30'
              } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border shadow-lg`}
              type="text"
              placeholder="Ask about satellite data, documentation, FAQs, or specific MOSDAC information..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button
            onClick={handleSend}
            className={`${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600'
                : 'bg-gradient-to-r from-blue-500 to-orange-400 hover:from-blue-600 hover:to-orange-500'
            } text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isTyping}
          >
            {isTyping ? '⏳' : '🚀'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-slate-900' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Animated satellites and stars on left and right */}
      <LeftSpaceAnimation />
      <RightSpaceAnimation />
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${
          theme === 'dark'
            ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
            : 'bg-white hover:bg-gray-100 text-slate-700'
        } shadow-lg transition-all duration-300 transform hover:scale-110`}
      >
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
      {/* Enhanced Space Background */}
      <SpaceBackground theme={theme} />
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className={`text-6xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-slate-800'
          }`}>
            <span className="bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
              MOSDAC AI Assistant
            </span>
          </h1>
          <p className={`${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          } text-xl max-w-4xl mx-auto leading-relaxed`}>
            AI-powered Help Bot for Information Retrieval from Knowledge Graph Based on Static/Dynamic Web Portal Content
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-blue-500/20 text-blue-500 text-sm rounded-full border border-blue-500/30 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Satellite Data Intelligence
            </div>
            <div className="px-4 py-2 bg-orange-500/20 text-orange-500 text-sm rounded-full border border-orange-500/30 flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Geospatial Query Processing
            </div>
            <div className="px-4 py-2 bg-green-500/20 text-green-500 text-sm rounded-full border border-green-500/30">
              🧠 NLP/ML Powered
            </div>
            <div className="px-4 py-2 bg-purple-500/20 text-purple-500 text-sm rounded-full border border-purple-500/30">
              📊 Dynamic Knowledge Graph
            </div>
          </div>
          
          {/* Additional Info */}
          <div className={`mt-8 p-6 rounded-2xl ${
            theme === 'dark' 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-white/50 border-slate-200'
          } border backdrop-blur-sm max-w-4xl mx-auto`}>
            <h3 className={`${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            } font-bold text-lg mb-3`}>Enhanced Portal Intelligence</h3>
            <p className={`${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            } text-sm leading-relaxed`}>
              This intelligent virtual assistant leverages advanced NLP/ML for precise information retrieval from the MOSDAC portal (www.mosdac.gov.in). 
              It processes structured and unstructured content including product catalogues, FAQs, documentation (PDF, DOCX, XLSX), 
              meta tags, satellite mission details, and scientific articles to provide contextual, relationship-based information discovery.
            </p>
          </div>
        </div>

        {/* Chatbot */}
        <Chatbot theme={theme} />
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className={`${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          } text-sm`}>
            Powered by MOSDAC Data & Advanced AI • Built for Space Exploration Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}