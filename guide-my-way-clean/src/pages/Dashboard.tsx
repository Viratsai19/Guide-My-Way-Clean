import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { VideoCard } from '@/components/video/VideoCard';
import { VideoUploader } from '@/components/video/VideoUploader';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { useVideos } from '@/hooks/useVideos';
import { Video } from '@/types/video';
import { 
  Video as VideoIcon, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Upload,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'safe' | 'flagged' | 'processing';

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { videos, isUploading, uploadVideo, deleteVideo } = useVideos();

  const stats = {
    total: videos.length,
    safe: videos.filter(v => v.status === 'safe').length,
    flagged: videos.filter(v => v.status === 'flagged').length,
    processing: videos.filter(v => v.status === 'processing' || v.status === 'uploading').length,
  };

  const filteredVideos = videos.filter(v => {
    if (filter === 'all') return true;
    if (filter === 'processing') return v.status === 'processing' || v.status === 'uploading';
    return v.status === filter;
  });

  const pageConfig = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your video library' },
    upload: { title: 'Upload Video', subtitle: 'Upload and process new videos' },
    library: { title: 'Video Library', subtitle: 'Manage all your uploaded videos' },
    users: { title: 'User Management', subtitle: 'Manage users and permissions' },
    settings: { title: 'Settings', subtitle: 'Configure application settings' },
  };

  const config = pageConfig[currentPage as keyof typeof pageConfig] || pageConfig.dashboard;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="lg:pl-64 min-h-screen">
        <Header title={config.title} subtitle={config.subtitle} />
        
        <div className="p-6 space-y-8">
          {/* Dashboard View */}
          {currentPage === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Videos"
                  value={stats.total}
                  icon={VideoIcon}
                  trend={{ value: 12, isPositive: true }}
                  variant="primary"
                />
                <StatsCard
                  title="Safe Content"
                  value={stats.safe}
                  icon={Shield}
                  subtitle="Passed sensitivity check"
                  variant="success"
                />
                <StatsCard
                  title="Flagged Content"
                  value={stats.flagged}
                  icon={AlertTriangle}
                  subtitle="Requires review"
                  variant="destructive"
                />
                <StatsCard
                  title="Processing"
                  value={stats.processing}
                  icon={Clock}
                  subtitle="Currently analyzing"
                  variant="warning"
                />
              </div>

              {/* Quick Upload */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Quick Upload</h2>
                    <p className="text-muted-foreground">Upload a new video for processing</p>
                  </div>
                  <Button variant="outline" onClick={() => setCurrentPage('upload')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Go to Upload Center
                  </Button>
                </div>
                <VideoUploader onUpload={uploadVideo} isUploading={isUploading} />
              </div>

              {/* Recent Videos */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Recent Videos</h2>
                  <Button variant="ghost" onClick={() => setCurrentPage('library')}>
                    View All →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {videos.slice(0, 3).map(video => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onPlay={setSelectedVideo}
                      onDelete={deleteVideo}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Upload View */}
          {currentPage === 'upload' && (
            <div className="max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 glow">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Video</h2>
                  <p className="text-muted-foreground">
                    Upload videos for automatic sensitivity analysis and secure streaming
                  </p>
                </div>
                <VideoUploader onUpload={uploadVideo} isUploading={isUploading} />
              </div>

              {/* Processing Pipeline Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: 1, title: 'Upload', desc: 'Secure file transfer with progress tracking' },
                  { step: 2, title: 'Analyze', desc: 'AI-powered content sensitivity detection' },
                  { step: 3, title: 'Stream', desc: 'Optimized video streaming with range requests' },
                ].map((item) => (
                  <div key={item.step} className="glass rounded-xl p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 text-primary font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Library View */}
          {currentPage === 'library' && (
            <>
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter:</span>
                  {(['all', 'safe', 'flagged', 'processing'] as FilterType[]).map((f) => (
                    <Button
                      key={f}
                      variant={filter === f ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilter(f)}
                      className="capitalize"
                    >
                      {f}
                      {f !== 'all' && (
                        <Badge variant="secondary" className="ml-2">
                          {f === 'processing' 
                            ? stats.processing 
                            : stats[f as keyof typeof stats]}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Video Grid/List */}
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              )}>
                {filteredVideos.map((video, index) => (
                  <div 
                    key={video.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <VideoCard
                      video={video}
                      onPlay={setSelectedVideo}
                      onDelete={deleteVideo}
                    />
                  </div>
                ))}
              </div>

              {filteredVideos.length === 0 && (
                <div className="text-center py-16">
                  <VideoIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No videos found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filter === 'all' 
                      ? "Upload your first video to get started" 
                      : `No ${filter} videos in your library`}
                  </p>
                  <Button variant="default" onClick={() => setCurrentPage('upload')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Users View */}
          {currentPage === 'users' && (
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Team Members</h2>
                <div className="space-y-4">
                  {[
                    { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
                    { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
                    { name: 'Mike Johnson', email: 'mike@example.com', role: 'Viewer', status: 'Active' },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                          <span className="text-sm font-semibold text-primary">{user.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Editor' ? 'secondary' : 'outline'}>
                          {user.role}
                        </Badge>
                        <Badge variant="success">{user.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {currentPage === 'settings' && (
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Sensitivity Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Auto-flag Threshold</p>
                      <p className="text-sm text-muted-foreground">Sensitivity level for automatic flagging</p>
                    </div>
                    <Badge variant="secondary">Medium (0.7)</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Processing Quality</p>
                      <p className="text-sm text-muted-foreground">Video analysis resolution</p>
                    </div>
                    <Badge variant="secondary">High (1080p)</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Storage Quota</p>
                      <p className="text-sm text-muted-foreground">Maximum storage allocation</p>
                    </div>
                    <Badge variant="secondary">50 GB</Badge>
                  </div>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Streaming Options</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Adaptive Bitrate</p>
                      <p className="text-sm text-muted-foreground">Enable HLS adaptive streaming</p>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Range Requests</p>
                      <p className="text-sm text-muted-foreground">Support for partial content delivery</p>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}
    </div>
  );
}
