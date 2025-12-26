export type VideoStatus = 'uploading' | 'processing' | 'safe' | 'flagged' | 'error';

export type UserRole = 'viewer' | 'editor' | 'admin';

export interface Video {
  id: string;
  title: string;
  description?: string;
  filename: string;
  size: number;
  duration?: number;
  thumbnail?: string;
  status: VideoStatus;
  processingProgress: number;
  uploadProgress: number;
  uploadedAt: Date;
  userId: string;
  flagReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface UploadProgress {
  videoId: string;
  progress: number;
  status: VideoStatus;
}
