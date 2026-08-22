import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Send,
  ArrowLeft,
  CheckCheck,
  Smile,
  Trash2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

interface ChatUser {
  _id: string;
  fullName: string;
  gender?: string;
  avatar?: string;
  photos?: { url: string; isPrimary: boolean }[];
}

const ChatsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("room");
  const otherUserId = searchParams.get("user");

  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const getProfilePhoto = (user: ChatUser | null) => {
    if (!user) return DummyProfile;
    if (user.photos && user.photos.length > 0) {
      const primary = user.photos.find((p) => p.isPrimary);
      if (primary?.url) return primary.url;
      if (user.photos[0]?.url) return user.photos[0].url;
    }
    if (user.avatar) return user.avatar;
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

  useEffect(() => {
    if (!otherUserId) return;

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
  }, [otherUserId]);

  useEffect(() => {
    if (roomId) {
      socket.emit("join-chat", roomId);
    }
  }, [roomId]);

  useEffect(() => {
    socket.on("receive-message", (data: any) => {
      const rawDate = new Date(data.createdAt || Date.now());
      const msg: Message = {
        id: data._id || Date.now().toString(),
        text: data.message,
        sender: data.sender === currentUser._id ? "me" : "other",
        time: rawDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        dateStr: rawDate.toDateString(),
        rawDate,
      };

      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!otherUserId) return;

      try {
        const token = localStorage.getItem("token");

        const res = await Axios(`/api/users/${otherUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChatUser(res.data);
      } catch {
        toast.error("Failed to load user");
      }
    };

    fetchUser();
  }, [otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!roomId) return;
      try {
        const res = await Axios.get(`/api/chat/messages/${roomId}`);

        const formatted = res.data.map((msg: any) => {
          const rawDate = new Date(msg.createdAt || Date.now());
          return {
            id: msg._id,
            text: msg.message,
            sender: msg.sender === currentUser._id ? "me" : "other",
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
  }, [roomId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit("send-message", {
      roomId,
      sender: currentUser._id,
      receiver: otherUserId,
      message: newMessage,
    });

    setNewMessage("");
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const deleteSelectedMessages = async () => {
    if (selectedMessages.length === 0) return;

    try {
      await Axios.delete("/api/chat/delete", {
        data: {
          messageIds: selectedMessages,
        },
      });

      setMessages((prev) =>
        prev.filter((msg) => !selectedMessages.includes(msg.id))
      );

      setSelectedMessages([]);

      toast.success("Messages deleted");
    } catch {
      toast.error("Failed to delete messages");
    }
  };

  const toggleSelectMessage = (id: string) => {
    setSelectedMessages((prev) =>
      prev.includes(id)
        ? prev.filter((msgId) => msgId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 bg-background flex justify-center items-center p-2 sm:p-4 overflow-hidden">
      <div className="w-full max-w-4xl h-full flex flex-col bg-card border rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="p-3 sm:p-4 border-b flex items-center justify-between bg-card/90 backdrop-blur-sm z-10">
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
                onClick={() => navigate(-1)}
                className="h-8 w-8 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <Avatar className="h-10 w-10 border border-primary/20 shadow-sm">
                <AvatarImage
                  src={getProfilePhoto(chatUser)}
                  alt={chatUser?.fullName || "User"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {chatUser?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-semibold text-sm sm:text-base leading-tight">
                  {chatUser?.fullName || "Chat User"}
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

        {/* MESSAGE AREA */}
        <ScrollArea className="flex-1 p-4 bg-muted/20">
          <div className="space-y-3">
            {messages.map((msg, index) => {
              const isSelected = selectedMessages.includes(msg.id);
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const showDateDivider =
                !prevMsg || prevMsg.dateStr !== msg.dateStr;

              return (
                <div key={msg.id} className="space-y-3">
                  {/* Date Divider */}
                  {showDateDivider && (
                    <div className="flex justify-center my-3">
                      <span className="text-[11px] font-medium bg-background/80 backdrop-blur-xs border text-muted-foreground px-3.5 py-1 rounded-full shadow-2xs">
                        {formatDateLabel(msg.rawDate)}
                      </span>
                    </div>
                  )}

                  <div
                    onClick={() => toggleSelectMessage(msg.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleSelectMessage(msg.id);
                    }}
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
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
                        {msg.sender === "me" && (
                          <CheckCheck className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* INPUT AREA */}
        <div className="p-3 border-t bg-card flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default ChatsPage;