import { useState, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Upload, RotateCw, ZoomIn, ZoomOut, X, Check } from "lucide-react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface StepThreeProps {
  errors?: { [key: string]: string };
}

const StepThree = ({ errors = {} }: StepThreeProps) => {
  const [physicallyChallenged, setPhysicallyChallenged] = useState("no");
  const [livesWithFamily, setLivesWithFamily] = useState("yes");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState([1]);
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
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
  };

  const getCroppedImg = async () => {
    if (!imgRef.current || !crop) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    const pixelRatio = window.devicePixelRatio;
    const cropWidth = (crop.width / 100) * imgRef.current.width;
    const cropHeight = (crop.height / 100) * imgRef.current.height;
    
    canvas.width = cropWidth * scaleX;
    canvas.height = cropHeight * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    const cropX = (crop.x / 100) * imgRef.current.width * scaleX;
    const cropY = (crop.y / 100) * imgRef.current.height * scaleY;

    // Apply rotation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom[0], zoom[0]);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      imgRef.current,
      cropX,
      cropY,
      cropWidth * scaleX,
      cropHeight * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCroppedImage(croppedDataUrl);
    setShowCropDialog(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
        <p className="text-muted-foreground">Share your personal characteristics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="height">Height (in cm) *</Label>
          <Input 
            id="height" 
            type="number" 
            placeholder="e.g., 170" 
            required 
            className={errors.height ? "border-destructive" : ""}
          />
          {errors.height && <p className="text-xs text-destructive">{errors.height}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (in kg) *</Label>
          <Input 
            id="weight" 
            type="number" 
            placeholder="e.g., 65" 
            required 
            className={errors.weight ? "border-destructive" : ""}
          />
          {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status *</Label>
          <Select>
            <SelectTrigger className={errors.maritalStatus ? "border-destructive" : ""}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="widow">Widow</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="awaiting-divorce">Awaiting Divorce</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="annulled">Annulled</SelectItem>
            </SelectContent>
          </Select>
          {errors.maritalStatus && <p className="text-xs text-destructive">{errors.maritalStatus}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyType">Body Type *</Label>
          <Select>
            <SelectTrigger className={errors.bodyType ? "border-destructive" : ""}>
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slim">Slim</SelectItem>
              <SelectItem value="athletic">Athletic</SelectItem>
              <SelectItem value="average">Average</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
            </SelectContent>
          </Select>
          {errors.bodyType && <p className="text-xs text-destructive">{errors.bodyType}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Physically Challenged? *</Label>
          <RadioGroup value={physicallyChallenged} onValueChange={setPhysicallyChallenged}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="pc-no" />
                <Label htmlFor="pc-no" className="font-normal cursor-pointer">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="pc-yes" />
                <Label htmlFor="pc-yes" className="font-normal cursor-pointer">Yes</Label>
              </div>
            </div>
          </RadioGroup>
          {physicallyChallenged === "yes" && (
            <Textarea 
              placeholder="Please provide details" 
              className="mt-2"
              rows={2}
            />
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="city">City You Live In *</Label>
          <Input 
            id="city" 
            placeholder="Start typing city name..." 
            required 
            className={errors.city ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">Google Places autocomplete integration</p>
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Do You Live With Family? *</Label>
          <RadioGroup value={livesWithFamily} onValueChange={setLivesWithFamily}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="lwf-yes" />
                <Label htmlFor="lwf-yes" className="font-normal cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="lwf-no" />
                <Label htmlFor="lwf-no" className="font-normal cursor-pointer">No</Label>
              </div>
            </div>
          </RadioGroup>
          {livesWithFamily === "no" && (
            <Input 
              placeholder="Family location" 
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Profile Image *</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {croppedImage ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary">
                <img 
                  src={croppedImage} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </Button>
            </div>
          ) : (
            <Card 
              className={`p-8 border-dashed border-2 hover:border-primary transition-colors cursor-pointer ${errors.profileImage ? "border-destructive" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">Upload your profile photo</p>
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop (Max 5MB)
                  </p>
                </div>
              </div>
            </Card>
          )}
          {errors.profileImage && <p className="text-xs text-destructive">{errors.profileImage}</p>}
        </div>
      </div>

      {/* Image Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop & Resize Image</DialogTitle>
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
                      maxHeight: '400px',
                      transform: `rotate(${rotation}deg) scale(${zoom[0]})`,
                      transition: 'transform 0.2s',
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
              <Button variant="outline" onClick={() => setShowCropDialog(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={getCroppedImg} className="bg-gradient-to-r from-primary to-secondary">
                <Check className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StepThree;
