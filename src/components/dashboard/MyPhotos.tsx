import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Axios from "@/axios/axios";
import { toast } from "sonner";

interface Photo {
  _id: string;
  url: string;
  isPrimary: boolean;
  approvalStatus: string;
}

const MyPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;

  // Mock photos data
  // const photos = [
  //   {
  //     id: 1,
  //     url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  //     isProfile: true,
  //   },
  //   {
  //     id: 2,
  //     url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  //     isProfile: false,
  //   },
  //   {
  //     id: 3,
  //     url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
  //     isProfile: false,
  //   },
  //   {
  //     id: 4,
  //     url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
  //     isProfile: false,
  //   },
  // ];

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(`/api/users/${userId}/photos`);
      setPhotos(response.data || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      await Axios.post(`/api/users/${userId}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Photo uploaded");
      fetchPhotos();
    } catch {
      toast.error("Upload failed");
    }
  };

  const setAsProfile = async (photoId: string) => {
    try {
      await Axios.patch(`/api/users/${userId}/photos/${photoId}/primary`);

      toast.success("Profile photo updated");
      fetchPhotos();
    } catch {
      toast.error("Failed to set profile photo");
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      await Axios.delete(`/api/users/${userId}/photos/${photoId}`);
      toast.success("Photo deleted");
      fetchPhotos();
    } catch {
      toast.error("Failed to delete photo");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Photos</h2>
        <Button
          className="bg-gradient-to-r from-primary to-secondary gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          Upload Photo
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Card
            key={photo._id}
            className="glass-card overflow-hidden group relative"
          >
            <div className="aspect-square relative">
              <img
                src={photo.url}
                alt={`Photo ${photo._id}`}
                className="w-full h-full object-cover"
              />
              {photo.isPrimary && (
                <div className="absolute top-2 left-2">
                  <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    Profile Picture
                  </div>
                </div>
              )}

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!photo.isPrimary && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white gap-1"
                    onClick={() => setAsProfile(photo._id)}
                  >
                    <Star className="w-3 h-3" />
                    Set as Profile
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-1"
                  onClick={() => deletePhoto(photo._id)}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {/* Upload New Photo Card */}
        <Card className="glass-card border-2 border-dashed border-primary/50 hover:border-primary transition-colors cursor-pointer"  onClick={() => fileInputRef.current?.click()}>
          <div className="aspect-square flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
            <Upload className="w-12 h-12" />
            <p className="font-medium">Upload New Photo</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MyPhotos;
