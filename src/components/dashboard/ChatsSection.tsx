import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Send,
  ArrowLeft,
  CheckCheck,
  Smile,
  Trash2,
  Search,
  MessageSquare,
  Users,
  Eye,
  Heart,
  Sparkles,
} from "lucide-react";
import socket from "@/socket";
import { toast } from "sonner";
import Axios from "@/axios/axios";
import EmojiPicker from "emoji-picker-react";
import FemaleDummy from "@/assets/UserWomen.png";
import MaleDummy from "@/assets/UserMen.png";
import DummyProfile from "@/assets/DummyProfile.png";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  dateStr: string;
  rawDate: Date;
}

interface ChatEligibleUser {
  _id: string;
  fullName: string;
  gender?: string;
  city?: string;
  state?: string;
  profession?: { name: string } | string;
  profileId?: string;
  photos?: { url: string; isPrimary: boolean }[];
  roomId: string;
  lastMessage?: {
    text: string;
    createdAt: string;
    sender: string;
  } | null;
  isProfileViewed: boolean;
  mutuallyInterested: boolean;
}

interface ChatsSectionProps {
  onNavigate?: (tab: string) => void;
}

const ChatsSection: React.FC<ChatsSectionProps> = ({ onNavigate }) => {
  const [chatUsers, setChatUsers] = useState<ChatEligibleUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<ChatEligibleUser | null>(null);

  // Active Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const selectedUserRef = useRef<ChatEligibleUser | null>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const myUserId = (currentUser._id || currentUser.id || "").toString();

  // Keep selectedUserRef synced
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const isMyMessage = (sender: any) => {
    if (!sender) return false;
    const senderId = (typeof sender === "object" ? sender._id || sender.id : sender).toString();
    return senderId === myUserId;
  };

  const getProfilePhoto = (user: ChatEligibleUser | null) => {
    if (!user) return DummyProfile;
    if (user.photos && user.photos.length > 0) {
      const primary = user.photos.find((p) => p.isPrimary);
      if (primary?.url) return primary.url;
      if (user.photos[0]?.url) return user.photos[0].url;
    }
    const g = (user.gender || "").toLowerCase();
    if (g === "female" || g === "lesbian") return FemaleDummy;
    if (g === "male" || g === "gay") return MaleDummy;
    return DummyProfile;
  };

  const formatDateLabel = (dateRaw: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (dateRaw.toDateString() === today.toDateString()) {
      return "Today";
    } else if (dateRaw.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return dateRaw.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Fetch eligible chat users (Mutually Interested AND Profile Viewed)
  const fetchChatUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const res = await Axios.get("/api/chat/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: ChatEligibleUser[] = res.data || [];
      setChatUsers(data);
      if (data.length > 0 && !selectedUserRef.current) {
        setSelectedUser(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch chat users", err);
      toast.error("Failed to load chatted users list");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchChatUsers();
  }, []);

  // Online status check for selected user
  useEffect(() => {
    if (!selectedUser?._id) return;

    const otherUserId = selectedUser._id.toString();
    socket.emit("check-user-status", { userId: otherUserId });

    const handleStatusResponse = (data: { userId: string; isOnline: boolean }) => {
      if (data.userId === otherUserId) {
        setIsOnline(data.isOnline);
      }
    };

    const handleStatusChanged = (data: { userId: string; isOnline: boolean }) => {
      if (data.userId === otherUserId) {
        setIsOnline(data.isOnline);
      }
    };

    socket.on("user-status-response", handleStatusResponse);
    socket.on("user-status-changed", handleStatusChanged);

    return () => {
      socket.off("user-status-response", handleStatusResponse);
      socket.off("user-status-changed", handleStatusChanged);
    };
  }, [selectedUser?._id]);

  // Join Socket Room for Selected User
  useEffect(() => {
    if (selectedUser?.roomId) {
      socket.emit("join-chat", selectedUser.roomId);
    }
  }, [selectedUser?.roomId]);

  // Socket Receive Message Listener
  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      const activeUser = selectedUserRef.current;
      if (!activeUser || data.roomId !== activeUser.roomId) return;

      const rawDate = new Date(data.createdAt || Date.now());
      const msg: Message = {
        id: data._id || Date.now().toString(),
        text: data.message,
        sender: isMyMessage(data.sender) ? "me" : "other",
        time: rawDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        dateStr: rawDate.toDateString(),
        rawDate,
      };

      setMessages((prev) => {
        // Prevent duplication if message already exists
        if (prev.some((m) => m.id === msg.id)) {
          return prev;
        }
        return [...prev, msg];
      });

      // Update last message in chat users sidebar
      setChatUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.roomId === data.roomId
            ? {
                ...u,
                lastMessage: {
                  text: data.message,
                  createdAt: new Date().toISOString(),
                  sender: data.sender,
                },
              }
            : u
        )
      );
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [myUserId]);

  // Auto Scroll internal chat container to bottom on message update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch Room Messages when selected user changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedUser?.roomId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await Axios.get(`/api/chat/messages/${selectedUser.roomId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const formatted: Message[] = (res.data || []).map((msg: any) => {
          const rawDate = new Date(msg.createdAt || Date.now());
          return {
            id: msg._id || Date.now().toString(),
            text: msg.message,
            sender: isMyMessage(msg.sender) ? "me" : "other",
            time: rawDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            dateStr: rawDate.toDateString(),
            rawDate,
          };
        });

        setMessages(formatted);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    loadMessages();
  }, [selectedUser?.roomId, myUserId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const text = newMessage.trim();
    const now = new Date();

    const localMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "me",
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      dateStr: now.toDateString(),
      rawDate: now,
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, localMsg]);

    const payload = {
      roomId: selectedUser.roomId,
      sender: myUserId,
      receiver: selectedUser._id,
      message: text,
    };

    socket.emit("send-message", payload);

    // Update last message in sidebar list
    setChatUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.roomId === selectedUser.roomId
          ? {
              ...u,
              lastMessage: {
                text,
                createdAt: now.toISOString(),
                sender: myUserId,
              },
            }
          : u
      )
    );

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const deleteSelectedMessages = async () => {
    if (selectedMessages.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      await Axios.delete("/api/chat/delete", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        data: { messageIds: selectedMessages },
      });

      setMessages((prev) => prev.filter((msg) => !selectedMessages.includes(msg.id)));
      setSelectedMessages([]);
      toast.success("Messages deleted");
    } catch {
      toast.error("Failed to delete messages");
    }
  };

  const toggleSelectMessage = (id: string) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const filteredUsers = chatUsers.filter((user) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const nameMatch = user.fullName?.toLowerCase().includes(query);
    const profName = typeof user.profession === "object" ? user.profession?.name : user.profession;
    const profMatch = profName?.toLowerCase().includes(query);
    const cityMatch = user.city?.toLowerCase().includes(query);
    return nameMatch || profMatch || cityMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 p-5 rounded-2xl border border-primary/20 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-primary" />
            Chat & Conversations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect with profiles where mutual interest is accepted and profile view permissions are granted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-background/80 px-3 py-1.5 gap-1.5 text-xs">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            Mutually Interested
          </Badge>
          <Badge variant="outline" className="bg-background/80 px-3 py-1.5 gap-1.5 text-xs">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            Profile Viewed
          </Badge>
        </div>
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden h-[600px] max-h-[80vh] flex flex-col md:flex-row">
        {/* LEFT SIDEBAR: Chatted / Eligible Users List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r flex flex-col bg-card/60 backdrop-blur-sm ${
            selectedUser ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search Header */}
          <div className="p-4 border-b space-y-3 bg-muted/20">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search chatted matches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background h-10 rounded-xl text-sm"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Chatted Users ({filteredUsers.length})</span>
              <span className="text-[11px] text-emerald-600 font-medium">● Online Filter</span>
            </div>
          </div>

          {/* Users List Container */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {loadingUsers ? (
              <div className="p-8 text-center text-sm text-muted-foreground space-y-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading chatted users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">No Chatted Profiles Found</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[220px] mx-auto">
                    Users will appear here once you have viewed their profile and accepted mutual interest.
                  </p>
                </div>
                {onNavigate && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-secondary text-xs gap-1.5 mt-2"
                    onClick={() => onNavigate("matches")}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Browse Matches
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUser?._id === user._id;
                  const profName =
                    typeof user.profession === "object" ? user.profession?.name : user.profession;

                  return (
                    <div
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all hover:bg-primary/5 ${
                        isSelected ? "bg-primary/10 border-l-4 border-primary font-medium" : ""
                      }`}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-12 w-12 border border-primary/20 shadow-sm">
                          <AvatarImage
                            src={getProfilePhoto(user)}
                            alt={user.fullName}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {user.fullName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-foreground truncate leading-tight">
                            {user.fullName}
                          </h4>
                          {user.lastMessage?.createdAt && (
                            <span className="text-[10px] text-muted-foreground shrink-0 ml-1">
                              {new Date(user.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {user.lastMessage?.text || (
                            <span className="italic text-primary/80">Start conversation...</span>
                          )}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                          {profName && (
                            <span className="text-muted-foreground truncate max-w-[120px]">
                              {profName}
                            </span>
                          )}
                          <div className="flex items-center gap-1 ml-auto">
                            <span title="Mutually Interested" className="text-pink-500">❤️</span>
                            <span title="Profile Viewed" className="text-amber-500">👁️</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Active Chat Room */}
        <div
          className={`flex-1 flex flex-col bg-background min-h-0 ${
            !selectedUser ? "hidden md:flex items-center justify-center" : "flex"
          }`}
        >
          {!selectedUser ? (
            <div className="text-center p-8 space-y-3">
              <MessageSquare className="w-12 h-12 text-primary/30 mx-auto" />
              <h3 className="font-semibold text-lg">Select a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Choose a profile from the list to view chat history and send real-time messages.
              </p>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="p-3 sm:p-4 border-b flex items-center justify-between bg-card/90 backdrop-blur-sm shrink-0 z-10">
                {selectedMessages.length > 0 ? (
                  <>
                    <span className="font-semibold text-sm sm:text-base">
                      {selectedMessages.length} selected
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={deleteSelectedMessages}
                        className="gap-1 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedMessages([])}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedUser(null)}
                      className="md:hidden h-8 w-8 rounded-full"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <Avatar className="h-10 w-10 border border-primary/20 shadow-sm">
                      <AvatarImage
                        src={getProfilePhoto(selectedUser)}
                        alt={selectedUser.fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {selectedUser.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold text-sm sm:text-base leading-tight">
                        {selectedUser.fullName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {isOnline ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* MESSAGES SCROLL AREA (Standard Flex Overflow Container) */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-muted/20 space-y-3 min-h-0"
              >
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
                    <p className="text-sm font-medium">No messages in this chat yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Say hello to {selectedUser.fullName}! 👋
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isSelected = selectedMessages.includes(msg.id);
                    const prevMsg = index > 0 ? messages[index - 1] : null;
                    const showDateDivider = !prevMsg || prevMsg.dateStr !== msg.dateStr;

                    return (
                      <div key={msg.id} className="space-y-3">
                        {showDateDivider && (
                          <div className="flex justify-center my-3">
                            <span className="text-[11px] font-medium bg-background/90 border border-border/60 text-muted-foreground px-3.5 py-1 rounded-full shadow-xs">
                              {formatDateLabel(msg.rawDate)}
                            </span>
                          </div>
                        )}

                        <div
                          onClick={() => toggleSelectMessage(msg.id)}
                          className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`relative max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm transition-all cursor-pointer ${
                              isSelected
                                ? "bg-destructive text-destructive-foreground ring-2 ring-destructive"
                                : msg.sender === "me"
                                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-br-xs"
                                : "bg-card border text-card-foreground rounded-bl-xs"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute -left-6 top-2 text-destructive font-bold">
                                ✓
                              </div>
                            )}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {msg.text}
                            </p>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 text-[10px] opacity-75 ${
                                msg.sender === "me"
                                  ? "text-primary-foreground/90"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span>{msg.time}</span>
                              {msg.sender === "me" && <CheckCheck className="h-3 w-3" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* MESSAGE INPUT BAR */}
              <div className="p-3 border-t bg-card flex items-center gap-2 shrink-0">
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    align="start"
                    className="p-0 border-none shadow-2xl rounded-2xl overflow-hidden w-auto"
                  >
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setNewMessage((prev) => prev + emojiData.emoji);
                      }}
                      autoFocusSearch={false}
                      width={320}
                      height={380}
                    />
                  </PopoverContent>
                </Popover>

                <Input
                  placeholder="Type message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-muted/40 border-muted focus-visible:ring-primary h-10 rounded-full px-4 text-sm"
                />

                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="h-10 w-10 rounded-full shrink-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md hover:opacity-90 transition"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsSection;
