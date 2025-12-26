import { useCallback, useState } from 'react';
import { Upload, Film, X, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface VideoUploaderProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export function VideoUploader({ onUpload, isUploading }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(f => f.type.startsWith('video/'));
    
    if (videoFile) {
      setSelectedFile(videoFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  }, [selectedFile, onUpload]);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 text-center",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-secondary/30",
          selectedFile && "border-success bg-success/5"
        )}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
            isDragging 
              ? "bg-primary/20 glow" 
              : selectedFile 
                ? "bg-success/20 glow-success" 
                : "bg-secondary"
          )}>
            {selectedFile ? (
              <FileVideo className="w-10 h-10 text-success" />
            ) : (
              <Upload className={cn(
                "w-10 h-10 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )} />
            )}
          </div>

          {selectedFile ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">
                {isDragging ? 'Drop your video here' : 'Drag & drop video files'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse from your computer
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Film className="w-4 h-4" />
            <span>Supported: MP4, WebM, MOV, AVI • Max 500MB</span>
          </div>
        </div>
      </div>

      {/* Selected File Actions */}
      {selectedFile && !isUploading && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={clearSelection}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button variant="hero" onClick={handleUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Start Upload
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center animate-pulse">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Uploading video...</p>
                <p className="text-sm text-muted-foreground">Please wait while we process your file</p>
              </div>
            </div>
          </div>
          <Progress value={45} status="processing" className="h-3" />
          <p className="text-sm text-center text-muted-foreground">
            This may take a few minutes depending on file size
          </p>
        </div>
      )}
    </div>
  );
}
