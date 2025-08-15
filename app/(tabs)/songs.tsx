import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Play, Pause, Heart, Search, Filter, Music, Shuffle,
} from 'lucide-react-native';
import PersistentPlayer from '@/components/PersistentPlayer';
import { setGlobalAudio } from '../../backend/utils/playerSingleton'; // adjust path as necessary

const { width } = Dimensions.get('window');

interface Song {
  id:string,
  //_id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  genre: string;
  isLiked: boolean;
  lyrics?: string[];
  audioUrl?: string;
}

// const BACKEND_URL = Platform.select({
//   web: 'http://localhost:3001',
//   //default: 'https://e64e7eaf7862.ngrok-free.app',
// });


const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3001';


// Helper for genres
const getAllGenres = (songs: Song[]) => {
  const uniqueGenres = Array.from(new Set(songs.map(song => song.genre))).sort();
  return ['All', ...uniqueGenres];
};

export default function SongsPage() {
  const router = useRouter();
  // State management
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  // Fetch songs
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/songs`)
      .then((res) => res.json())
      .then((data) => {
        const normalizedSongs = data.map((song: any) => ({
          ...song,
          id: song.id,
        }));
        setSongs(normalizedSongs);
        setLoading(false);
        console.log('BACKEND_URL:', BACKEND_URL);
      })
      .catch((err) => {
        console.error('Failed to fetch songs:', err);
        setLoading(false);
      });
  }, []);

  // Dynamic genre filter
  const genres = getAllGenres(songs);

  // Filtered songs
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || song.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const currentSong = songs.find((song) => song.id === currentlyPlaying) || null;
const handleGoToDetail = () => {
  router.push({ pathname: '/song-detail', params: { id: currentSong._id } });
};


  // Convert mm:ss to seconds
  const getTotalSeconds = (duration: string) => {
    const [min, sec] = duration.split(':').map(Number);
    return (min || 0) * 60 + (sec || 0);
  };

  // Main playback logic — always 1 audio instance
  const togglePlay = async (songId: string) => {
    const selectedSong = songs.find((s) => s.id === songId);
    if (!selectedSong || !selectedSong.audioUrl) return;

    // If playing and same song, pause
    if (isPlaying && currentlyPlaying === songId && sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      return;
    }
    // If paused and same song, play
    if (!isPlaying && currentlyPlaying === songId && sound) {
      await sound.playAsync();
      setIsPlaying(true);
      return;
    }
    // Stop old sound
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    // Load new sound
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: selectedSong.audioUrl },
      { shouldPlay: true, isMuted }
    );
    setSound(newSound);
    setGlobalAudio(newSound, songId);
    setCurrentlyPlaying(songId);
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      const secs = status.positionMillis / 1000;
      const total = getTotalSeconds(selectedSong.duration);
      setCurrentTime(Math.floor(secs));
      setProgress((secs / total) * 100);
    });
  };

  // Pause/play controls for persistent player
  const handlePlayPause = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  // Like/unlike UI toggle
  const toggleLike = (songId: string) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === songId ? { ...song, isLiked: !song.isLiked } : song
      )
    );
  };

  // Next/Previous playback
  const handleNext = () => {
    if (!currentlyPlaying || !filteredSongs.length) return;
    const idx = filteredSongs.findIndex(s => s.id === currentlyPlaying);
    if (idx === -1) return;
    const nextIndex = (idx + 1) % filteredSongs.length;
    togglePlay(filteredSongs[nextIndex].id);
  };
  const handlePrevious = () => {
    if (!currentlyPlaying || !filteredSongs.length) return;
    const idx = filteredSongs.findIndex(s => s.id === currentlyPlaying);
    if (idx === -1) return;
    const prevIndex = idx === 0 ? filteredSongs.length - 1 : idx - 1;
    togglePlay(filteredSongs[prevIndex].id);
  };

  // Mute toggle, keeps audio in sync
  const toggleMute = async () => {
    if (sound) {
      await sound.setIsMutedAsync(!isMuted);
    }
    setIsMuted(!isMuted);
  };

  // Handler for opening detail (required for PersistentPlayer)
  

  // UI Rendering
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FF6B35', '#FF8C5A']} style={styles.header}>
        <Text style={styles.headerTitle}>Your Music</Text>
        <Text style={styles.headerSubtitle}>Discover amazing tracks</Text>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#FF6B35" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#FF6B35" />
          </TouchableOpacity>
        </View>
        {/* Genre Filter Chips */}
        <View style={styles.genreSection}>
          <Text style={styles.genreLabel}>Genres</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.genreScrollContainer}
            contentContainerStyle={styles.genreScrollContent}
          >
            {genres.map((genre, index) => (
              <TouchableOpacity
                key={genre}
                style={[
                  styles.genreChip,
                  selectedGenre === genre && styles.genreChipActive,
                  index === 0 && styles.genreChipFirst,
                  index === genres.length - 1 && styles.genreChipLast,
                ]}
                onPress={() => setSelectedGenre(genre)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.genreText,
                    selectedGenre === genre && styles.genreTextActive,
                  ]}
                >
                  {genre}
                </Text>
                <View style={[
                  styles.genreCount,
                  selectedGenre === genre && styles.genreCountActive,
                ]}>
                  <Text style={[
                    styles.genreCountText,
                    selectedGenre === genre && styles.genreCountTextActive,
                  ]}>
                    {genre === 'All'
                      ? songs.length
                      : songs.filter(song => song.genre === genre).length}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
      {/* Songs List */}
      <ScrollView
        style={styles.songsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: currentSong ? 140 : 80 }}
      >
        <View style={styles.songsHeader}>
          <Text style={styles.songsCount}>
            {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
            {selectedGenre !== 'All' && (
              <Text style={styles.genreFilter}> in {selectedGenre}</Text>
            )}
          </Text>
          <TouchableOpacity style={styles.shuffleButton}>
            <Shuffle size={16} color="#FF6B35" />
            <Text style={styles.shuffleText}>Shuffle</Text>
          </TouchableOpacity>
        </View>
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <TouchableOpacity
              key={song.id}
              style={[
                styles.songItem,
                currentlyPlaying === song.id && styles.songItemActive,
              ]}
              onPress={() => togglePlay(song.id)}
            >
              <Image source={{ uri: song.image }} style={styles.songImage} />
              {/* Song information */}
              <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>
                  {song.title}
                </Text>
                <Text style={styles.songArtist} numberOfLines={1}>
                  {song.artist} • {song.album}
                </Text>
                <Text style={styles.songGenre}>{song.genre}</Text>
              </View>
              {/* Song actions */}
              <View style={styles.songActions}>
                <Text style={styles.songDuration}>{song.duration}</Text>
                {/* Like/Unlike button */}
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={e => {
                    e.stopPropagation();
                    toggleLike(song.id);
                  }}
                >
                  <Heart
                    size={20}
                    color={song.isLiked ? '#FF6B35' : '#999'}
                    fill={song.isLiked ? '#FF6B35' : 'transparent'}
                  />
                </TouchableOpacity>
                {/* Play/Pause button */}
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={e => {
                    e.stopPropagation();
                    togglePlay(song.id);
                  }}
                >
                  {currentlyPlaying === song.id && isPlaying && !isMuted ? (
                    <Pause size={20} color="#FF6B35" fill="#FF6B35" />
                  ) : (
                    <Play size={20} color="#FF6B35" fill="#FF6B35" />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noSongsContainer}>
            <Music size={48} color="#E9ECEF" />
            <Text style={styles.noSongsTitle}>No songs found</Text>
            <Text style={styles.noSongsText}>
              {searchQuery
                ? `No songs match "${searchQuery}"${selectedGenre !== 'All' ? ` in ${selectedGenre}` : ''}`
                : `No songs available in ${selectedGenre}`}
            </Text>
            {(searchQuery || selectedGenre !== 'All') && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedGenre('All');
                }}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      {/* Persistent Player (always pass onOpenDetail) */}
      <PersistentPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        isMuted={isMuted}
        currentTime={currentTime}
        progress={progress}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onToggleMute={toggleMute}
        onOpenDetail={handleGoToDetail} // <-- Fixes the crash!
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header Styles
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 20,
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
  },
  filterButton: {
    padding: 4,
  },

  // Genre Filter Styles - Enhanced for horizontal scrolling
  genreSection: {
    marginBottom: 8,
  },
  genreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    opacity: 0.9,
  },
  genreScrollContainer: {
    flexGrow: 0, // Prevent taking up extra space
  },
  genreScrollContent: {
    paddingRight: 20, // Extra padding at the end
  },
  genreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: 44, // Consistent height for all chips
  },
  genreChipFirst: {
    marginLeft: 0, // No extra margin for first chip
  },
  genreChipLast: {
    marginRight: 0, // No margin for last chip
  },
  genreChipActive: {
    backgroundColor: '#FFFFFF', // White background when selected
    borderColor: '#FFFFFF',
  },
  genreText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  genreTextActive: {
    color: '#FF6B35', // Orange text when selected
  },
  genreCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  genreCountActive: {
    backgroundColor: '#FF6B35', // Orange background when chip is active
  },
  genreCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  genreCountTextActive: {
    color: '#FFFFFF', // White text when chip is active
  },

  // Songs List Styles
  songsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  songsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  songsCount: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '600',
  },
  genreFilter: {
    color: '#FF6B35',
    fontWeight: '700',
  },
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shuffleText: {
    color: '#FF6B35',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },

  // Song Item Styles
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  songItemActive: {
    backgroundColor: '#FFF5F3', // Light orange background when playing
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1, // Take up remaining space
    marginRight: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  songGenre: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  songActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  songDuration: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  likeButton: {
    padding: 4,
  },
  playButton: {
    padding: 4,
  },

  // No Songs Found Styles
  noSongsContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  noSongsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6C757D',
    marginTop: 16,
    marginBottom: 8,
  },
  noSongsText: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  clearFiltersText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});