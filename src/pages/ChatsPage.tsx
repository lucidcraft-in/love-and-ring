import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  Smile,
  Paperclip,
  Mic,
  Video,
  Phone,
  MoreVertical,
  X,
  Camera,
  CameraOff,
  MicOff,
  PhoneOff
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import socket from "@/socket";
import { toast } from "sonner";
import Axios from "@/axios/axios";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

interface ChatUser {
  _id: string;
  fullName: string;
  avatar?: string;
}

const ChatsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("room");
  const otherUserId = searchParams.get("user");

  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  console.log("chat user data in the chatpage", chatUser)
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showVideoCall, setShowVideoCall] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");


  useEffect(() => {
    if (roomId) {
      socket.emit("join-chat", roomId);
    }
  }, [roomId]);


  useEffect(() => {
    socket.on("receive-message", (data: any) => {

      const msg: Message = {
        id: data._id || Date.now().toString(),
        text: data.message,
        sender: data.sender === currentUser._id ? "me" : "other",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      };

      setMessages(prev => [...prev, msg]);
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
            Authorization: `Bearer ${token}`
          }
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


  const handleSendMessage = () => {

    if (!newMessage.trim()) return;

    socket.emit("send-message", {
      roomId,
      sender: currentUser._id,
      receiver: otherUserId,
      message: newMessage
    });

    setNewMessage("");

  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };


  useEffect(() => {

    const loadMessages = async () => {

      const res = await Axios.get(`/api/chat/messages/${roomId}`)

      const formatted = res.data.map((msg: any) => ({
        id: msg._id,
        text: msg.message,
        sender: msg.sender === currentUser._id ? "me" : "other",
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }))

      setMessages(formatted)

    }

    loadMessages()

  }, [roomId])


  const handleVideoCall = () => {
    setShowVideoCall(true);
  };

  const endVideoCall = () => {
    setShowVideoCall(false);
    toast.info("Call ended");
  };

  useEffect(() => {

    if (currentUser?._id) {
      socket.emit("register", currentUser._id);
    }

  }, []);

  return (
    <div className="min-h-screen bg-background pt-16">

      <div className="h-[calc(100vh-4rem)] flex flex-col">

        {/* HEADER */}

        <div className="p-4 border-b flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <Avatar>
              <AvatarImage src={chatUser?.avatar} />
              <AvatarFallback>
                {chatUser?.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold">
                {chatUser?.fullName}
              </h3>
              <p className="text-xs text-muted-foreground">
                Online
              </p>
            </div>

          </div>

          {/* <div className="flex items-center gap-2">

            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleVideoCall}
            >
              <Video className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>

          </div> */}

        </div>

        {/* MESSAGE AREA */}

        <ScrollArea className="flex-1 p-4">

          <div className="space-y-4">

            {messages.map((msg) => (

              <div
                key={msg.id}
                className={`flex ${msg.sender === "me"
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >

                <div
                  className={`max-w-[70%] rounded-lg p-3 ${msg.sender === "me"
                      ? "bg-primary text-white"
                      : "bg-muted"
                    }`}
                >

                  <p className="text-sm">{msg.text}</p>

                  <div className="flex items-center justify-end gap-1 mt-1 text-xs opacity-70">

                    <span>{msg.time}</span>

                    {msg.sender === "me" && (
                      <CheckCheck className="h-3 w-3 text-blue-400" />
                    )}

                  </div>

                </div>

              </div>

            ))}

            <div ref={messagesEndRef} />

          </div>

        </ScrollArea>

        {/* INPUT */}

        <div className="p-4 border-t flex items-center gap-2">

          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>

          <Input
            placeholder="Type message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <Button
            size="icon"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>

        </div>

      </div>

      {/* VIDEO CALL */}

      <Dialog open={showVideoCall} onOpenChange={setShowVideoCall}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">

          <div className="w-full h-full bg-black flex flex-col">

            <div className="flex-1 flex items-center justify-center text-white text-xl">
              Video Call with {chatUser?.fullName}
            </div>

            <div className="flex justify-center gap-6 p-6">

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMicOn(!isMicOn)}
              >
                {isMicOn ? <Mic /> : <MicOff />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCameraOn(!isCameraOn)}
              >
                {isCameraOn ? <Camera /> : <CameraOff />}
              </Button>

              <Button
                size="icon"
                className="bg-red-500"
                onClick={endVideoCall}
              >
                <PhoneOff />
              </Button>

            </div>

          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ChatsPage;