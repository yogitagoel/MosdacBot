import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

const initialMessages = [
  { sender: 'bot', text: 'Hello! How can I assist you today?' },
];

function SpaceBackground() {
  const satelliteRef = useRef();
  const planetRef = useRef();
  const starsRef = useRef();

  useEffect(() => {
    // Animate satellite orbit
    gsap.to(satelliteRef.current, {
      rotate: 360,
      transformOrigin: '50% 50%',
      repeat: -1,
      duration: 10,
      ease: 'linear',
    });
    // Animate planet rotation
    gsap.to(planetRef.current, {
      rotate: 360,
      transformOrigin: '50% 50%',
      repeat: -1,
      duration: 20,
      ease: 'linear',
    });
    // Animate stars twinkling
    gsap.to(starsRef.current.children, {
      opacity: 0.3,
      yoyo: true,
      repeat: -1,
      stagger: 0.2,
      duration: 1.5,
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" viewBox="0 0 400 600" className="absolute inset-0 w-full h-full">
        {/* Stars */}
        <g ref={starsRef}>
          <circle cx="50" cy="100" r="2" fill="#ffd600" />
          <circle cx="120" cy="200" r="1.5" fill="#fff" />
          <circle cx="300" cy="80" r="2" fill="#ff9800" />
          <circle cx="350" cy="300" r="1.2" fill="#fff" />
          <circle cx="200" cy="500" r="1.8" fill="#ffd600" />
        </g>
        {/* Planet */}
        <g ref={planetRef}>
          <circle cx="340" cy="540" r="40" fill="#23232a" stroke="#ffd600" strokeWidth="4" />
          <ellipse cx="340" cy="540" rx="55" ry="10" fill="#ff9800" opacity="0.2" />
        </g>
        {/* Satellite */}
        <g ref={satelliteRef}>
          <rect x="80" y="60" width="18" height="8" fill="#ff9800" stroke="#ffd600" strokeWidth="1" rx="2" />
          <rect x="75" y="62" width="6" height="4" fill="#fff" />
          <rect x="98" y="62" width="6" height="4" fill="#fff" />
          <rect x="87" y="58" width="2" height="12" fill="#ffd600" />
        </g>
      </svg>
    </div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { sender: 'user', text: input },
      { sender: 'bot', text: "I'm just a demo! Your backend will answer here." },
    ]);
    setInput('');
  };

  return (
    <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-xl p-6 flex flex-col h-[500px] md:h-[600px] font-sans">
      <SpaceBackground />
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-surface">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm shadow-md transition-all duration-200 font-heading
                ${msg.sender === 'user'
                  ? 'bg-primary text-text-light rounded-br-none'
                  : 'bg-background text-primary rounded-bl-none border border-primary/30'}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 rounded-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 font-body"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-text-light px-4 py-2 rounded-full font-semibold hover:bg-accent transition-colors duration-200 shadow-md font-heading"
        >
          Send
        </button>
      </form>
    </div>
  );
} 