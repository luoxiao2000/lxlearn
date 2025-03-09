import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useAuth } from './AuthContext';

interface VideoPlayerProps {
  courseId: number;
  videoUrl: string;
  initialProgress: number;
  autoplay?: boolean;
}

const VideoPlayer = ({ courseId, videoUrl, initialProgress, autoplay = false }: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const { saveProgress } = useAuth();
  const [playing, setPlaying] = useState(autoplay);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progressUpdateTimeout, setProgressUpdateTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasInitialSeek, setHasInitialSeek] = useState(false);

  // Save progress when user stops watching
  const handleSaveProgress = () => {
    if (!playerRef.current) return;
    
    const currentTime = playerRef.current.getCurrentTime() || 0;
    const duration = playerRef.current.getDuration() || 1; // Prevent division by zero
    const progress = Math.min(currentTime / duration, 1);
    const completed = progress >= 0.95; // Consider completed if watched 95% or more
    
    // Update user progress using the auth context's saveProgress function
    saveProgress(courseId, progress, completed);
    
    // Dispatch a custom event that the dashboard can listen for
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('progressUpdated'));
    }
  };

  // Save progress when component unmounts
  useEffect(() => {
    return () => {
      if (progressUpdateTimeout) {
        clearTimeout(progressUpdateTimeout);
      }
      // Only save progress if we have actual progress to save
      if (playerRef.current && playerRef.current.getCurrentTime() > 0) {
        handleSaveProgress();
      }
    };
  }, []);

  // Handle initial seek after player is ready and duration is available
  useEffect(() => {
    if (isReady && duration > 0 && initialProgress > 0 && initialProgress < 0.95 && !hasInitialSeek) {
      // Add a small delay to ensure the player is fully loaded
      const seekTimeout = setTimeout(() => {
        if (playerRef.current) {
          const targetTime = initialProgress * duration;
          console.log(`Seeking to ${targetTime}s (${initialProgress * 100}% of ${duration}s)`);
          playerRef.current.seekTo(targetTime, 'seconds');
          setCurrentTime(targetTime);
          setHasInitialSeek(true);
        }
      }, 500);
      
      return () => clearTimeout(seekTimeout);
    }
  }, [isReady, duration, initialProgress, hasInitialSeek]);

  // Update progress periodically while playing
  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        if (playerRef.current) {
          setCurrentTime(playerRef.current.getCurrentTime() || 0);
          
          // Debounce progress updates
          if (progressUpdateTimeout) {
            clearTimeout(progressUpdateTimeout);
          }
          
          const timeout = setTimeout(() => {
            handleSaveProgress();
          }, 5000);
          
          setProgressUpdateTimeout(timeout);
        }
      }, 20000);
      
      return () => clearInterval(interval);
    }
  }, [playing]);

  const handleReady = () => {
    console.log("Player is ready");
    setIsReady(true);
    
    // Get the duration as soon as the player is ready
    if (playerRef.current) {
      const playerDuration = playerRef.current.getDuration();
      console.log(`Duration: ${playerDuration}s`);
      setDuration(playerDuration);
    }
  };

  const handleDuration = (duration: number) => {
    console.log(`Duration updated: ${duration}s`);
    setDuration(duration);
  };

  const handlePlay = () => {
    console.log("Video playing");
    setPlaying(true);
  };

  const handlePause = () => {
    console.log("Video paused");
    setPlaying(false);
    handleSaveProgress();
  };

  const handleEnded = () => {
    console.log("Video ended");
    setPlaying(false);
    handleSaveProgress();
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleError = (error: any) => {
    console.error("Video player error:", error);
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width="100%"
        height="auto"
        playing={playing}
        controls={true}
        onReady={handleReady}
        onDuration={handleDuration}
        onProgress={handleProgress}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        progressInterval={1000}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              onContextMenu: (e: React.MouseEvent<HTMLVideoElement>) => e.preventDefault(),
            },
            forceVideo: true,
          },
        }}
      />
    </div>
  );
};

export default VideoPlayer; 