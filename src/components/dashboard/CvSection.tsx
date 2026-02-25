import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, FileText, Eye, Download, Trash2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import Axios from "@/axios/axios";

interface CvSectionProps {
  userId: string;
  cvUrl?: string;
  cvFileName?: string;
  cvUploadedAt?: string;
  onCvUpdated: () => void;
}

const MAX_CV_SIZE = 5 * 1024 * 1024;

const CvSection = ({ userId, cvUrl, cvFileName, cvUploadedAt, onCvUpdated }: CvSectionProps) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Only PDF, DOC, and DOCX files are accepted");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_CV_SIZE) {
      toast.error("File size must be less than 5MB");
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("cv", file);

      await Axios.post(`/api/users/${userId}/cv`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      toast.success("CV uploaded successfully 🎉");
      onCvUpdated();
      setReplacing(false);
    } catch (err) {
      console.error("CV upload failed", err);
      toast.error("Failed to upload CV");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await Axios.delete(`/api/users/${userId}/cv`, { headers });
      toast.success("CV deleted successfully");
      onCvUpdated();
    } catch (err) {
      console.error("CV delete failed", err);
      toast.error("Failed to delete CV");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const hasCv = !!cvUrl && !replacing;

  return (
    <Card className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        CV / Resume
      </h3>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />

      {hasCv ? (
        <Card className="p-5 border bg-muted/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{cvFileName || "CV Document"}</p>
                {cvUploadedAt && (
                  <p className="text-xs text-muted-foreground">
                    Uploaded: {new Date(cvUploadedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(cvUrl, "_blank")}
              >
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
              <a href={cvUrl} download={cvFileName} className="inline-flex">
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
              </a>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-secondary text-white"
                onClick={() => {
                  setReplacing(true);
                  setTimeout(() => fileInputRef.current?.click(), 100);
                }}
              >
                <RefreshCw className="w-4 h-4 mr-1" /> Replace
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          className={`p-8 border-dashed border-2 hover:border-primary transition-colors cursor-pointer ${uploading ? "opacity-60 pointer-events-none" : ""}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-medium">{uploading ? "Uploading..." : "Upload your CV"}</p>
              <p className="text-sm text-muted-foreground">
                PDF, DOC, DOCX – Max 5MB
              </p>
            </div>
            {replacing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setReplacing(false);
                }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            )}
          </div>
        </Card>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete CV?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your uploaded CV? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CvSection;
