import { Video } from '@/types/video';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Trash2, MoreVertical, Eye, Clock, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
  onPlay?: (video: Video) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  uploading: { badge: 'processing', label: 'Uploading', icon: '⬆️' },
  processing: { badge: 'processing', label: 'Processing', icon: '⚙️' },
  safe: { badge: 'success', label: 'Safe', icon: '✓' },
  flagged: { badge: 'destructive', label: 'Flagged', icon: '⚠️' },
  error: { badge: 'destructive', label: 'Error', icon: '✕' },
} as const;

function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function VideoCard({ video, onPlay, onDelete }: VideoCardProps) {
  const config = statusConfig[video.status];
  const isProcessing = video.status === 'uploading' || video.status === 'processing';
  const progress = video.status === 'uploading' ? video.uploadProgress : video.processingProgress;

  return (
    <div 
      className={cn(
        "group glass rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/50",
        isProcessing && "animate-pulse-slow"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-secondary to-muted overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-foreground/70" />
          </div>
        </div>
        
        {/* Status overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4">
            <div className="text-2xl">{config.icon}</div>
            <p className="text-sm font-medium text-foreground">{config.label}</p>
            <div className="w-full max-w-32">
              <Progress 
                value={progress} 
                status="processing" 
                className="h-2"
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
          </div>
        )}

        {/* Hover overlay */}
        {!isProcessing && (
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button 
              variant="default" 
              size="lg"
              onClick={() => onPlay?.(video)}
              className="scale-90 group-hover:scale-100 transition-transform duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Play
            </Button>
          </div>
        )}

        {/* Duration badge */}
        {video.duration && !isProcessing && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{video.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{video.filename}</p>
          </div>
          <Badge variant={config.badge as any}>
            {config.label}
          </Badge>
        </div>

        {video.flagReason && video.status === 'flagged' && (
          <p className="text-xs text-destructive bg-destructive/10 rounded-lg p-2 border border-destructive/20">
            {video.flagReason}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            {formatFileSize(video.size)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.uploadedAt.toLocaleDateString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onPlay?.(video)}
            disabled={isProcessing}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete?.(video.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
