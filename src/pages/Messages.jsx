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
  RefreshCw,
  X,
} from "lucide-react";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, whatsapp, messenger, calls
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.phone, selectedChat.platform);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      console.log("📋 Fetching conversations from API...");

      const response = await fetch(
        "http://localhost:5000/api/messages/conversations"
      );
      const result = await response.json();

      if (result.success) {
        setConversations(result.data || []);
        console.log(`✅ Loaded ${result.data?.length || 0} conversations`);
      } else {
        throw new Error(result.message || "Failed to fetch conversations");
      }
    } catch (error) {
      console.error("❌ Error fetching conversations:", error);
      if (window.showToast) {
        window.showToast("Failed to load conversations", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (phone, platform) => {
    try {
      console.log(`📋 Fetching messages for ${phone} (${platform})...`);

      const response = await fetch(
        `http://localhost:5000/api/messages/conversations/${phone}/messages?platform=${platform}`
      );
      const result = await response.json();

      if (result.success) {
        setMessages(result.data || []);
        console.log(`✅ Loaded ${result.data?.length || 0} messages`);
      } else {
        throw new Error(result.message || "Failed to fetch messages");
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      if (window.showToast) {
        window.showToast("Failed to load messages", "error");
      }
    }
  };

  const syncConversations = async () => {
    try {
      setSyncing(true);
      console.log("🔄 Syncing conversations from APIs...");

      const response = await fetch("http://localhost:5000/api/messages/sync", {
        method: "POST",
      });
      const result = await response.json();

      if (result.success) {
        if (window.showToast) {
          window.showToast(`Synced ${result.count} conversations`, "success");
        }
        // Refresh conversations after sync
        await fetchConversations();
      } else {
        throw new Error(result.message || "Failed to sync conversations");
      }
    } catch (error) {
      console.error("❌ Error syncing conversations:", error);
      if (window.showToast) {
        window.showToast("Failed to sync conversations", "error");
      }
    } finally {
      setSyncing(false);
    }
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
      platform: selectedChat.platform,
    };

    // Add message to UI immediately
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedChat.platform,
          phone: selectedChat.phone,
          text: message,
          clientId: selectedChat.clientId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update message status to sent
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
          )
        );

        // Update conversation last message
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedChat.id
              ? { ...conv, lastMessage: message, timestamp: "now" }
              : conv
          )
        );

        if (window.showToast) {
          window.showToast("Message sent successfully!", "success");
        }
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      // Update message status to failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "failed" } : msg
        )
      );

      if (window.showToast) {
        window.showToast("Failed to send message", "error");
      }
    }
  };

  const makeCall = async (phone, type = "voice") => {
    try {
      const response = await fetch("http://localhost:5000/api/calls/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, type, clientId: selectedChat?.clientId }),
      });
      const result = await response.json();

      if (result.success) {
        if (window.showToast) {
          window.showToast(`${type} call initiated to ${phone}`, "success");
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("❌ Failed to initiate call:", error);
      if (window.showToast) {
        window.showToast("Failed to initiate call", "error");
      }
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.phone?.toLowerCase().includes(searchQuery.toLowerCase());
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
      case "failed":
        return <X className="w-4 h-4 text-red-500" />;
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
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <div className="flex space-x-2">
              <button
                onClick={syncConversations}
                disabled={syncing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Sync conversations from WhatsApp & Messenger"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-600 ${
                    syncing ? "animate-spin" : ""
                  }`}
                />
              </button>
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
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No conversations found</p>
              <button
                onClick={syncConversations}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Sync from APIs
              </button>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={`${conversation.phone}_${conversation.platform}`}
                onClick={() => setSelectedChat(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat?.phone === conversation.phone &&
                  selectedChat?.platform === conversation.platform
                    ? "bg-blue-50 border-blue-200"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={
                        conversation.avatar ||
                        "/placeholder.svg?height=48&width=48"
                      }
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
                        {conversation.name || conversation.phone}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage || "No messages yet"}
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
            ))
          )}
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
                      src={
                        selectedChat.avatar ||
                        "/placeholder.svg?height=40&width=40"
                      }
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
                      {selectedChat.name || selectedChat.phone}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">
                      {selectedChat.platform} • {selectedChat.status}
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
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400">
                    Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
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
                ))
              )}
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
                    placeholder={`Type a message to ${
                      selectedChat.name || selectedChat.phone
                    }...`}
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
              {conversations.length === 0 && (
                <button
                  onClick={syncConversations}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sync Conversations
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
