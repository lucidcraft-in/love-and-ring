import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContactsViewed = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const contacts = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 26,
      location: "Mumbai",
      phone: "+91 98765 43210",
      viewedOn: "2024-01-15",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      status: "online",
    },
    {
      id: 2,
      name: "Anjali Patel",
      age: 24,
      location: "Ahmedabad",
      phone: "+91 98765 43211",
      viewedOn: "2024-01-14",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      status: "offline",
    },
    {
      id: 3,
      name: "Sneha Reddy",
      age: 27,
      location: "Hyderabad",
      phone: "+91 98765 43212",
      viewedOn: "2024-01-13",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      status: "online",
    },
    {
      id: 4,
      name: "Kavya Nair",
      age: 25,
      location: "Kerala",
      phone: "+91 98765 43213",
      viewedOn: "2024-01-12",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
      status: "offline",
    },
  ];

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Contact Viewed</h1>
            <p className="text-muted-foreground">People whose contacts you have viewed</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Contacts List */}
        <div className="grid gap-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="glass-card p-4 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${
                      contact.status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {contact.age} yrs
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.location}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-primary">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Viewed: {new Date(contact.viewedOn).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/profile/${contact.id}`)}>
                    View Profile
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsViewed;
