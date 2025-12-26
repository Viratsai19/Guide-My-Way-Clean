import { useState, useCallback, useEffect } from 'react';
import { Video, VideoStatus } from '@/types/video';

const generateId = () => Math.random().toString(36).substr(2, 9);
const STORAGE_KEY = 'vidsecure_videos';

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Product Demo 2024',
    description: 'Annual product demonstration video',
    filename: 'product-demo-2024.mp4',
    size: 125000000,
    duration: 180,
    status: 'safe',
    processingProgress: 100,
    uploadProgress: 100,
    uploadedAt: new Date('2024-12-20'),
    userId: '1',
  },
  {
    id: '2',
    title: 'Team Meeting Recording',
    description: 'Weekly team standup meeting',
    filename: 'team-meeting.mp4',
    size: 89000000,
    duration: 3600,
    status: 'processing',
    processingProgress: 67,
    uploadProgress: 100,
    uploadedAt: new Date('2024-12-25'),
    userId: '1',
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Q4 marketing campaign video',
    filename: 'marketing-q4.mp4',
    size: 250000000,
    duration: 120,
    status: 'flagged',
    processingProgress: 100,
    uploadProgress: 100,
    uploadedAt: new Date('2024-12-24'),
    userId: '1',
    flagReason: 'Contains potentially sensitive content',
  },
];

const loadVideosFromStorage = (): Video[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((v: Video) => ({
        ...v,
        uploadedAt: new Date(v.uploadedAt),
      }));
    }
  } catch (e) {
    console.error('Failed to load videos from storage:', e);
  }
  return mockVideos;
};

const saveVideosToStorage = (videos: Video[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (e) {
    console.error('Failed to save videos to storage:', e);
  }
};

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>(() => loadVideosFromStorage());
  const [isUploading, setIsUploading] = useState(false);

  // Persist videos to localStorage whenever they change
  useEffect(() => {
    saveVideosToStorage(videos);
  }, [videos]);

  const uploadVideo = useCallback((file: File) => {
    setIsUploading(true);
    
    const newVideo: Video = {
      id: generateId(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      filename: file.name,
      size: file.size,
      status: 'uploading',
      processingProgress: 0,
      uploadProgress: 0,
      uploadedAt: new Date(),
      userId: '1',
    };

    setVideos(prev => [newVideo, ...prev]);

    // Simulate upload progress
    let uploadProgress = 0;
    const uploadInterval = setInterval(() => {
      uploadProgress += Math.random() * 15;
      if (uploadProgress >= 100) {
        uploadProgress = 100;
        clearInterval(uploadInterval);
        
        setVideos(prev =>
          prev.map(v =>
            v.id === newVideo.id
              ? { ...v, uploadProgress: 100, status: 'processing' as VideoStatus }
              : v
          )
        );

        // Simulate processing
        let processingProgress = 0;
        const processInterval = setInterval(() => {
          processingProgress += Math.random() * 10;
          if (processingProgress >= 100) {
            processingProgress = 100;
            clearInterval(processInterval);
            
            const isSafe = Math.random() > 0.3;
            setVideos(prev =>
              prev.map(v =>
                v.id === newVideo.id
                  ? {
                      ...v,
                      processingProgress: 100,
                      status: isSafe ? 'safe' : 'flagged',
                      flagReason: isSafe ? undefined : 'Content requires review',
                    }
                  : v
              )
            );
            setIsUploading(false);
          } else {
            setVideos(prev =>
              prev.map(v =>
                v.id === newVideo.id
                  ? { ...v, processingProgress }
                  : v
              )
            );
          }
        }, 300);
      } else {
        setVideos(prev =>
          prev.map(v =>
            v.id === newVideo.id
              ? { ...v, uploadProgress }
              : v
          )
        );
      }
    }, 200);

    return newVideo.id;
  }, []);

  const deleteVideo = useCallback((id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  }, []);

  const getVideoById = useCallback((id: string) => {
    return videos.find(v => v.id === id);
  }, [videos]);

  return {
    videos,
    isUploading,
    uploadVideo,
    deleteVideo,
    getVideoById,
  };
}
