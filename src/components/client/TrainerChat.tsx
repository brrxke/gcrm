import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'trainer';
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hi! Ready to crush your goals today?",
    sender: 'trainer',
    timestamp: '10:30 AM'
  },
  {
    id: 2,
    text: "Yes! What's the plan for today?",
    sender: 'user',
    timestamp: '10:32 AM'
  },
  {
    id: 3,
    text: "We'll focus on upper body strength. Start with 10 min warm-up, then bench press 4x8, pull-ups 3x12, and shoulder press 3x10.",
    sender: 'trainer',
    timestamp: '10:33 AM'
  },
  {
    id: 4,
    text: "Got it! Should I increase weight from last session?",
    sender: 'user',
    timestamp: '10:35 AM'
  },
  {
    id: 5,
    text: "Yes, add 5lbs to bench press. Keep form strict. Let me know how it goes.",
    sender: 'trainer',
    timestamp: '10:36 AM'
  },
];

export function TrainerChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate trainer response
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        text: "I'll get back to you shortly!",
        sender: 'trainer',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <Card className="bg-card border-border p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-white">Coach Marcus</h3>
              <p className="text-sm text-muted-foreground">Personal Trainer</p>
            </div>
          </div>
        </Card>

        {/* Messages */}
        <Card className="bg-card border-border flex-1 p-4 overflow-y-auto mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-black'
                      : 'bg-muted text-white'
                  }`}
                >
                  <p className="mb-1">{message.text}</p>
                  <p className={`text-xs ${
                    message.sender === 'user' ? 'text-black/60' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Input */}
        <Card className="bg-card border-border p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="bg-input border-border text-white flex-1"
            />
            <Button
              onClick={handleSend}
              className="bg-primary hover:bg-primary/90 text-black px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
