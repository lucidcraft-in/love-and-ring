import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Smile, 
  Paperclip, 
  Mic,
  ArrowLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  X,
  Trash2,
  Ban,
  Flag,
  Camera,
  CameraOff,
  MicOff,
  PhoneOff,
  Square,
  File,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
  status: "sent" | "delivered" | "read";
}

interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  typing?: boolean;
}

const EMOJI_LIST = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
  "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "☺️", "😚",
  "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
  "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
  "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮",
  "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💕",
  "💞", "💓", "💗", "💖", "💘", "💝", "💟", "👍", "👎", "👏"
];

const ChatsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I saw your profile and found it interesting.", sender: "other", time: "10:30 AM", status: "read" },
    { id: 2, text: "Hello! Thank you for reaching out 😊", sender: "me", time: "10:32 AM", status: "read" },
    { id: 3, text: "I noticed we have similar interests. Would you like to know more about me?", sender: "other", time: "10:35 AM", status: "read" },
    { id: 4, text: "Yes, I'd love to! Tell me more about your hobbies.", sender: "me", time: "10:36 AM", status: "read" },
    { id: 5, text: "I love traveling, reading books, and cooking. I've been to 15 countries so far!", sender: "other", time: "10:40 AM", status: "read" },
    { id: 6, text: "That's amazing! I also love traveling. Which was your favorite destination?", sender: "me", time: "10:42 AM", status: "delivered" },
  ]);

  const chatUsers: ChatUser[] = [
    {
      id: 1,
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      lastMessage: "That's amazing! I also love traveling...",
      time: "10:42 AM",
      unread: 0,
      online: true,
    },
    {
      id: 2,
      name: "Anjali Patel",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      lastMessage: "Sure, let's connect tomorrow!",
      time: "Yesterday",
      unread: 2,
      online: true,
      typing: true,
    },
    {
      id: 3,
      name: "Sneha Reddy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      lastMessage: "Nice to meet you!",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: 4,
      name: "Kavya Nair",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
      lastMessage: "Thanks for accepting my request",
      time: "2 days ago",
      unread: 1,
      online: false,
    },
    {
      id: 5,
      name: "Meera Iyer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      lastMessage: "Looking forward to hearing from you",
      time: "3 days ago",
      unread: 0,
      online: true,
    },
  ];

  const filteredChats = chatUsers.filter(
    (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleClearChat = () => {
    setMessages([]);
    toast.success("Chat cleared");
  };

  const handleBlockUser = () => {
    toast.success(`${selectedChat?.name} has been blocked`);
  };

  const handleReportUser = () => {
    toast.success(`${selectedChat?.name} has been reported`);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    toast.success("Voice message recorded");
    setRecordingTime(0);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    setRecordingTime(0);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoCall = () => {
    setShowVideoCall(true);
  };

  const endVideoCall = () => {
    setShowVideoCall(false);
    setIsCameraOn(true);
    setIsMicOn(true);
    toast.info("Call ended");
  };

  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 pt-16">
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Sidebar - Chat List */}
        <div className={`w-full md:w-96 border-r bg-background flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">Chats</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            {filteredChats.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b ${
                  selectedChat?.id === user.id ? 'bg-muted/50' : ''
                }`}
                onClick={() => setSelectedChat(user)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{user.name}</h3>
                    <span className="text-xs text-muted-foreground">{user.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {user.typing ? (
                        <span className="text-green-500">typing...</span>
                      ) : (
                        user.lastMessage
                      )}
                    </p>
                    {user.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {user.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Window */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-background">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-background">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setSelectedChat(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                  <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleVideoCall}>
                  <Video className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleClearChat} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBlockUser} className="text-destructive">
                      <Ban className="h-4 w-4 mr-2" />
                      Block User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleReportUser} className="text-destructive">
                      <Flag className="h-4 w-4 mr-2" />
                      Report User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        <span className="text-xs">{message.time}</span>
                        {message.sender === "me" && (
                          message.status === "read" ? (
                            <CheckCheck className="h-3 w-3 text-blue-400" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background">
              {isRecording ? (
                /* Recording UI */
                <div className="flex items-center gap-4 bg-destructive/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                    <span className="text-destructive font-medium">Recording...</span>
                    <span className="text-muted-foreground">{formatRecordingTime(recordingTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={cancelRecording}>
                      <X className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Button 
                      size="icon" 
                      onClick={stopRecording}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Emoji Picker */}
                  <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Smile className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-2" align="start">
                      <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
                        {EMOJI_LIST.map((emoji, index) => (
                          <button
                            key={index}
                            className="text-xl hover:bg-muted rounded p-1 transition-colors"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Attachment Menu */}
                  <Popover open={showAttachMenu} onOpenChange={setShowAttachMenu}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="start">
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" className="justify-start gap-2" onClick={() => {
                          setShowAttachMenu(false);
                          toast.info("Select image to send");
                        }}>
                          <ImageIcon className="h-4 w-4 text-blue-500" />
                          Photo
                        </Button>
                        <Button variant="ghost" className="justify-start gap-2" onClick={() => {
                          setShowAttachMenu(false);
                          toast.info("Select file to send");
                        }}>
                          <File className="h-4 w-4 text-purple-500" />
                          Document
                        </Button>
                        <Button variant="ghost" className="justify-start gap-2" onClick={() => {
                          setShowAttachMenu(false);
                          toast.info("Share location");
                        }}>
                          <MapPin className="h-4 w-4 text-green-500" />
                          Location
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  {newMessage.trim() ? (
                    <Button 
                      size="icon" 
                      onClick={handleSendMessage}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={startRecording}>
                      <Mic className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-muted/30">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Select a chat</h3>
              <p className="text-muted-foreground">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Call Dialog */}
      <Dialog open={showVideoCall} onOpenChange={setShowVideoCall}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
          <div className="relative w-full h-full bg-gray-900 flex flex-col">
            {/* Video Area */}
            <div className="flex-1 relative">
              {/* Remote Video (Full Screen) */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isCameraOn ? (
                  <img 
                    src={selectedChat?.avatar} 
                    alt={selectedChat?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={selectedChat?.avatar} alt={selectedChat?.name} />
                      <AvatarFallback className="text-4xl">{selectedChat?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-white text-lg">Camera Off</p>
                  </div>
                )}
              </div>

              {/* Local Video (Small) */}
              <div className="absolute bottom-4 right-4 w-32 h-44 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white text-xs">You</p>
                </div>
              </div>

              {/* Call Info */}
              <div className="absolute top-4 left-4 text-white">
                <h3 className="font-semibold text-lg">{selectedChat?.name}</h3>
                <p className="text-sm text-white/70">Video Call</p>
              </div>

              {/* Close Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={endVideoCall}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Controls */}
            <div className="p-6 bg-gray-900/90 flex items-center justify-center gap-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full w-14 h-14 ${!isMicOn ? 'bg-destructive text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                onClick={() => setIsMicOn(!isMicOn)}
              >
                {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full w-14 h-14 ${!isCameraOn ? 'bg-destructive text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                onClick={() => setIsCameraOn(!isCameraOn)}
              >
                {isCameraOn ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
              </Button>
              <Button 
                size="icon" 
                className="rounded-full w-16 h-16 bg-destructive hover:bg-destructive/90 text-white"
                onClick={endVideoCall}
              >
                <PhoneOff className="h-7 w-7" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatsPage;
