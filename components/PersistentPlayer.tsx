import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Song interface - same as in song-detail.tsx
interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  genre: string;
  isLiked: boolean;
}

// Props interface for the PersistentPlayer component
interface PersistentPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentTime: number;
  progress: number;
  onOpenDetail: () => void;
}


export default function PersistentPlayer({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  isMuted = false,
  onToggleMute,
  currentTime = 0,
  progress = 0,
  onOpenDetail,          
}: PersistentPlayerProps) {
  // Now onOpenDetail is defined and ready to use

  const router = useRouter();

  // Local state for timer (used when currentTime is not provided)
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Animated value for smooth progress bar movement
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Use provided time/progress or fall back to local state
  const displayTime = currentTime || localCurrentTime;
  const displayProgress = progress || localProgress;

  // Navigate to song detail page when player is tapped
  const goToDetail = () => {
    if (currentSong?.id) {
      router.push(`/song-detail?id=${currentSong.id}`);
    }
  };

  // Helper function: Convert seconds to MM:SS format
  const formatTime = (totalSeconds: number) => {
    // Ensure we have a valid number
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      return '0:00';
    }
    
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert duration string to total seconds
  const getTotalSeconds = (duration: string) => {
    const parts = duration.split(':');
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return minutes * 60 + seconds;
  };

  // Create pan responder for draggable progress bar
  const panResponder = PanResponder.create({
    // Allow the gesture to start
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    // Handle gesture start
    onPanResponderGrant: (event) => {
      setIsDragging(true);
      handleSeekToPosition(event.nativeEvent.locationX);
    },

    // Handle gesture movement
    onPanResponderMove: (event) => {
      handleSeekToPosition(event.nativeEvent.locationX);
    },

    // Handle gesture end
    onPanResponderRelease: () => {
      setIsDragging(false);
    },
  });

  // Handle seeking to a specific position
  const handleSeekToPosition = (locationX: number) => {
    if (!currentSong) return;
    
    // Calculate progress bar width (account for padding)
    const progressBarWidth = width - 40; // 20px padding on each side
    
    // Calculate percentage of where user touched/dragged
    const seekPercentage = Math.max(0, Math.min(1, locationX / progressBarWidth));
    
    // Convert to actual time
    const totalSeconds = getTotalSeconds(currentSong.duration);
    const newTime = Math.floor(seekPercentage * totalSeconds);
    const newProgress = seekPercentage * 100;
    
    // Update local state
    setLocalCurrentTime(newTime);
    setLocalProgress(newProgress);
    
    // Update animation immediately for responsive feedback
    Animated.timing(progressAnimation, {
      toValue: newProgress,
      duration: 0, // Immediate update during drag
      useNativeDriver: false,
    }).start();
  };

  // Update animation when progress changes (from parent or local state)
  useEffect(() => {
    if (!isDragging) {
      Animated.timing(progressAnimation, {
        toValue: displayProgress,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [displayProgress, isDragging, progressAnimation]);

  // Timer effect - only runs if parent doesn't provide currentTime/progress
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Only run local timer if no external time is provided and song is playing
    if (isPlaying && currentSong && !isMuted && currentTime === 0 && !isDragging) {
      // Convert duration string to total seconds
      const totalSeconds = getTotalSeconds(currentSong.duration);

      // Update timer every second
      interval = setInterval(() => {
        setLocalCurrentTime((prevTime) => {
          const newTime = prevTime + 1;
          
          // Check if song has ended
          if (newTime >= totalSeconds) {
            setLocalProgress(100);
            return totalSeconds;
          }
          
          // Update progress percentage
          const newProgress = (newTime / totalSeconds) * 100;
          setLocalProgress(newProgress);
          return newTime;
        });
      }, 1000); // Update every 1000ms (1 second)
    }

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, currentSong, isMuted, currentTime, isDragging]);

  // Don't render if no song is selected
  if (!currentSong) return null;

  return (
    <View style={styles.container}>
      {/* Draggable progress bar at the top */}
      <View 
        style={styles.progressContainer}
        {...panResponder.panHandlers}
      >
        <View style={styles.progressBar}>
          {/* Animated progress fill */}
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressAnimation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                })
              }
            ]} 
          />
        </View>
      </View>

      {/* Main player content */}
      <TouchableOpacity activeOpacity={0.9} onPress={onOpenDetail}>
        <LinearGradient
          colors={['#FF6B35', '#FF8C5A']}
          style={styles.playerContent}
        >
          {/* Album artwork */}
          <Image source={{ uri: currentSong.image }} style={styles.albumArt} />

          {/* Song information */}
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {currentSong.title}
            </Text>
            <Text style={styles.songArtist} numberOfLines={1}>
              {currentSong.artist}
            </Text>
          </View>

          {/* Time display */}
          <View style={styles.timeInfo}>
            <Text style={styles.timeText}>
              {formatTime(displayTime)} / {currentSong.duration}
            </Text>
          </View>

          {/* Playback controls */}
          <View style={styles.controls}>
            {/* Previous song button */}
            <TouchableOpacity style={styles.controlButton} onPress={onPrevious}>
              <SkipBack size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Play/Pause button */}
            <TouchableOpacity style={styles.playButton} onPress={onPlayPause}>
              {/* Show pause icon if playing and not muted, otherwise show play icon */}
              {isPlaying && !isMuted ? (
                <Pause size={24} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </TouchableOpacity>

            {/* Next song button */}
            <TouchableOpacity style={styles.controlButton} onPress={onNext}>
              <SkipForward size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Volume/Mute button */}
          <TouchableOpacity 
            style={styles.volumeButton} 
            onPress={onToggleMute}
          >
            {/* Show mute icon if muted, otherwise show volume icon */}
            {isMuted ? (
              <VolumeX size={20} color="#FFFFFF" />
            ) : (
              <Volume2 size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Position above tab bar
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  
  // Progress bar styles
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 2,
    paddingTop: 10, // Larger touch area
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 107, 53, 0.3)', // Semi-transparent background
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35', // Orange progress fill
    borderRadius: 1.5,
  },
  
  // Main player content styles
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  // Album art styles
  albumArt: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  
  // Song info styles
  songInfo: {
    flex: 1, // Take up remaining space
    marginRight: 8,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  
  // Time display styles
  timeInfo: {
    marginRight: 12,
  },
  timeText: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  
  // Control button styles
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  controlButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  playButton: {
    padding: 6,
    marginHorizontal: 4,
  },
  volumeButton: {
    padding: 4,
  },
});