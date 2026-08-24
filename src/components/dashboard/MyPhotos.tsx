import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Upload, Star, Trash2, RotateCw, ZoomIn, ZoomOut, X, Check } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import Axios from "@/axios/axios";
import { toast } from "sonner";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import ProtectedProfileImage from "./ProtectedProfileImage";

interface Photo {
  _id: string;
  url: string;
  isPrimary: boolean;
  approvalStatus: string;
}

const MyPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Photo Delete Confirmation State
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Crop & Adjustment states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState([1]);
  const [rotation, setRotation] = useState(0);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id;

  const fetchPhotos = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await Axios.get(`/api/users/${userId}/photos`, { headers });
      setPhotos(response.data || []);
      console.log("Photos:", response.data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropDialog(true);
        setRotation(0);
        setZoom([1]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const newCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 80,
          },
          1,
          width,
          height,
        ),
        width,
        height,
      );
      setCrop(newCrop);
    },
    [],
  );

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = { "Content-Type": "multipart/form-data" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await Axios.post(`/api/users/${userId}/photos`, formData, { headers });

      toast.success("Photo uploaded successfully 🎉");
      fetchPhotos();
      window.dispatchEvent(new Event("userProfileUpdated"));
    } catch {
      toast.error("Upload failed");
    }
  };

  const getCroppedImg = async () => {
    if (!imgRef.current || !crop) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropWidth = (crop.width / 100) * image.width;
    const cropHeight = (crop.height / 100) * image.height;

    canvas.width = cropWidth * scaleX;
    canvas.height = cropHeight * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingQuality = "high";

    const cropX = (crop.x / 100) * image.width * scaleX;
    const cropY = (crop.y / 100) * image.height * scaleY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom[0], zoom[0]);

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth * scaleX,
      cropHeight * scaleY,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height,
    );

    ctx.restore();

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        const file = new File([blob], "photo.jpg", {
          type: "image/jpeg",
        });

        setShowCropDialog(false);
        setUploading(true);
        await handleUpload(file);
        setUploading(false);
      },
      "image/jpeg",
      0.9,
    );
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const setAsProfile = async (photoId: string) => {
    try {
      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await Axios.patch(`/api/users/${userId}/photos/${photoId}/primary`, {}, { headers });

      toast.success("Profile photo updated 🎉");
      await fetchPhotos();

      // Sync photos in local storage user object
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (currentUser && Array.isArray(currentUser.photos)) {
        currentUser.photos = currentUser.photos.map((p: any) => ({
          ...p,
          isPrimary: p._id === photoId || p.id === photoId,
        }));
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else if (res.data?.photos) {
        currentUser.photos = res.data.photos;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }

      window.dispatchEvent(new Event("userProfileUpdated"));
    } catch (error: any) {
      console.error("Error setting primary photo:", error);
      toast.error(error?.response?.data?.message || "Failed to set profile photo");
    }
  };

  const handleDeleteClick = (photoId: string) => {
    setPhotoToDelete(photoId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;
    setDeleteLoading(true);
    try {
      if (!userId) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await Axios.delete(`/api/users/${userId}/photos/${photoToDelete}`, { headers });

      toast.success("Photo deleted");
      fetchPhotos();
      window.dispatchEvent(new Event("userProfileUpdated"));
      setShowDeleteConfirm(false);
      setPhotoToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete photo");
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Photos</h2>
        <Button
          className="bg-gradient-to-r from-primary to-secondary gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Photo"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => {
          const photoId = photo._id || (photo as any).id;
          return (
            <Card
              key={photoId}
              className="glass-card overflow-hidden group relative"
            >
              <div className="aspect-square relative">
                <ProtectedProfileImage
                  src={photo.url}
                  alt={`Photo ${photoId}`}
                  className="w-full h-full object-cover"
                  showWatermark={false}
                />
                {photo.isPrimary && (
                  <div className="absolute top-2 left-2 z-20">
                    <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-white" />
                      Profile Picture
                    </div>
                  </div>
                )}

                {/* Overlay with actions - z-20 to sit above ProtectedProfileImage protection shield */}
                <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-auto">
                  {!photo.isPrimary && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 hover:bg-white text-black font-semibold gap-1 cursor-pointer shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setAsProfile(photoId);
                      }}
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Set as Profile
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1 cursor-pointer font-semibold shadow-md"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(photoId);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Upload New Photo Card */}
        <Card
          className="glass-card border-2 border-dashed border-primary/50 hover:border-primary transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="aspect-square flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
            <Upload className="w-12 h-12" />
            <p className="font-medium">Upload New Photo</p>
          </div>
        </Card>
      </div>

      {/* Photo Adjustment & Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop & Adjust Photo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedImage && (
              <div className="relative max-h-[400px] overflow-hidden flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={selectedImage}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    style={{
                      maxHeight: "400px",
                      transform: `rotate(${rotation}deg) scale(${zoom[0]})`,
                      transition: "transform 0.2s",
                    }}
                  />
                </ReactCrop>
              </div>
            )}

            {/* Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <ZoomOut className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={zoom}
                  onValueChange={setZoom}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <ZoomIn className="w-4 h-4 text-muted-foreground" />
              </div>

              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRotate}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCropDialog(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={getCroppedImg}
                disabled={uploading}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                <Check className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Apply & Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Photo?"
        description="Are you sure you want to delete this photo from your profile? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default MyPhotos;

