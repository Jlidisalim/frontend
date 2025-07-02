"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Phone,
  Video,
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Filter,
  Plus,
  MessageSquare,
} from "lucide-react";

const MessagingCenter = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, whatsapp, messenger, calls
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Sample data - replace with API calls
  const sampleConversations = [
    {
      id: 1,
      clientId: 92,
      name: "Salim Jlidi",
      avatar: "/api/placeholder/40/40",
      lastMessage: "I'm interested in the Kelibia property",
      timestamp: "2 min ago",
      unread: 2,
      platform: "whatsapp",
      status: "online",
      phone: "+216 26901747",
      messages: [
        {
          id: 1,
          text: "Hello, I saw your property listing",
          sender: "client",
          timestamp: "10:30 AM",
          status: "read",
        },
        {
          id: 2,
          text: "Hi! Which property are you interested in?",
          sender: "agent",
          timestamp: "10:32 AM",
          status: "read",
        },
        {
          id: 3,
          text: "The villa in Kelibia, is it still available?",
          sender: "client",
          timestamp: "10:35 AM",
          status: "read",
        },
        {
          id: 4,
          text: "Yes, it's still available! Would you like to schedule a visit?",
          sender: "agent",
          timestamp: "10:36 AM",
          status: "delivered",
        },
        {
          id: 5,
          text: "I'm interested in the Kelibia property",
          sender: "client",
          timestamp: "10:40 AM",
          status: "sent",
        },
      ],
    },
    {
      id: 2,
      clientId: 89,
      name: "Ahmed Ben Ali",
      avatar: "/api/placeholder/40/40",
      lastMessage: "When can we schedule the visit?",
      timestamp: "1 hour ago",
      unread: 0,
      platform: "messenger",
      status: "away",
      phone: "+216 54172654",
      messages: [
        {
          id: 1,
          text: "Good morning!",
          sender: "client",
          timestamp: "9:15 AM",
          status: "read",
        },
        {
          id: 2,
          text: "Good morning! How can I help you?",
          sender: "agent",
          timestamp: "9:16 AM",
          status: "read",
        },
        {
          id: 3,
          text: "When can we schedule the visit?",
          sender: "client",
          timestamp: "9:20 AM",
          status: "read",
        },
      ],
    },
    {
      id: 3,
      clientId: 88,
      name: "Fatma Gharbi",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Thank you for the information",
      timestamp: "Yesterday",
      unread: 0,
      platform: "whatsapp",
      status: "offline",
      phone: "+216 98765432",
      messages: [
        {
          id: 1,
          text: "Can you send me more photos?",
          sender: "client",
          timestamp: "Yesterday 3:20 PM",
          status: "read",
        },
        {
          id: 2,
          text: "Of course! Here are more photos of the property",
          sender: "agent",
          timestamp: "Yesterday 3:25 PM",
          status: "read",
        },
        {
          id: 3,
          text: "Thank you for the information",
          sender: "client",
          timestamp: "Yesterday 3:30 PM",
          status: "read",
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConversations(sampleConversations);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "agent",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sending",
    };

    // Update local state
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedChat.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: message,
          timestamp: "now",
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    });
    setMessage("");

    // Simulate API call to send message
    try {
      await sendMessageAPI(selectedChat.platform, selectedChat.phone, message);
      // Update message status to sent
      setTimeout(() => {
        const finalConversations = updatedConversations.map((conv) => {
          if (conv.id === selectedChat.id) {
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
              ),
            };
          }
          return conv;
        });
        setConversations(finalConversations);
      }, 1000);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const sendMessageAPI = async (platform, phone, text) => {
    // This would integrate with your WhatsApp/Messenger APIs
    const response = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, phone, text }),
    });
    return response.json();
  };

  const makeCall = async (phone, type = "voice") => {
    try {
      const response = await fetch("/api/calls/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, type }),
      });
      const result = await response.json();
      console.log("Call initiated:", result);
    } catch (error) {
      console.error("Failed to initiate call:", error);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "whatsapp" && conv.platform === "whatsapp") ||
      (activeTab === "messenger" && conv.platform === "messenger");
    return matchesSearch && matchesTab;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <Check className="w-4 h-4 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      case "sending":
        return <Clock className="w-4 h-4 text-gray-400 animate-spin" />;
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "whatsapp":
        return <div className="w-3 h-3 bg-green-500 rounded-full" />;
      case "messenger":
        return <div className="w-3 h-3 bg-blue-500 rounded-full" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
            {[
              { id: "all", label: "All", icon: MessageCircle },
              { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
              { id: "messenger", label: "Messenger", icon: MessageCircle },
              { id: "calls", label: "Calls", icon: Phone },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat?.id === conversation.id
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.avatar || "/placeholder.svg"}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 flex items-center space-x-1">
                    {getPlatformIcon(conversation.platform)}
                    <div
                      className={`w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                        conversation.status
                      )}`}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedChat.avatar || "/placeholder.svg"}
                      alt={selectedChat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                        selectedChat.status
                      )}`}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedChat.name}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">
                      {selectedChat.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => makeCall(selectedChat.phone, "voice")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => makeCall(selectedChat.phone, "video")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "agent" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === "agent"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end space-x-1 mt-1 ${
                        msg.sender === "agent"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="text-xs">{msg.timestamp}</span>
                      {msg.sender === "agent" && getStatusIcon(msg.status)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingCenter;
