import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image,
  Dimensions, PanResponder, Animated, ActivityIndicator
} from 'react-native';
import {
  ArrowLeft, Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, MoreHorizontal
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Song {
  // _id: string; // (Add if you want; your API returns it)
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  genre: string;
  isLiked: boolean;
  lyrics: string[];
  audioUrl: string;
}

export default function SongDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optionally: UI player state (still works!)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const thumbPosition = useRef(new Animated.Value(0)).current;

  // --- Fetch Song ---
  useEffect(() => {
    if (!id) {
      setError('No song ID provided');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3001/api/songs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch song');
        return res.json();
      })
      .then(data => {
        setSong(data);
      })
      .catch(err => {
        setError(err.message || 'Song not found');
        setSong(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // --- Render States ---
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!song) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Song not loaded.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Main UI ---
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity>
          <MoreHorizontal size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.albumArtContainer}>
          <Image source={{ uri: song.image }} style={styles.albumArt} />
        </View>

        <Text style={styles.songTitle}>{song.title}</Text>
        <Text style={styles.songArtist}>{song.artist}</Text>
        <Text style={styles.songAlbum}>{song.album} • {song.genre}</Text>

        {/* --- Optional: Lyrics --- */}
        {song.lyrics?.length > 0 && (
          <View style={styles.lyricsContainer}>
            <Text style={styles.lyricsHeader}>Lyrics</Text>
            {song.lyrics.map((line, idx) => (
              <Text key={idx} style={styles.lyricsLine}>{line}</Text>
            ))}
          </View>
        )}

        {/* --- Optional: Audio URL status --- */}
        <Text style={styles.songDetails}>
          Audio: {song.audioUrl ? '✅' : '❌'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50 },
  loadingText: { textAlign: 'center', marginTop: 16, fontSize: 16, color: '#FF6B35' },
  errorText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#FF0000' },
  backText: { textAlign: 'center', marginTop: 20, color: '#FF6B35', fontWeight: '500' },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingBottom: 16,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  albumArtContainer: { alignItems: 'center', paddingVertical: 40 },
  albumArt: { width: width * 0.8, height: width * 0.8, borderRadius: 20 },
  songTitle: { textAlign: 'center', fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#2C3E50' },
  songArtist: { textAlign: 'center', fontSize: 16, color: '#6C757D' },
  songAlbum: { textAlign: 'center', fontSize: 14, marginBottom: 24, color: '#6C757D' },
  songDetails: { textAlign: 'center', color: '#6C757D', marginTop: 12 },
  lyricsContainer: { padding: 24, marginTop: 20 },
  lyricsHeader: { fontSize: 18, fontWeight: '600', color: '#2C3E50', marginBottom: 12 },
  lyricsLine: { fontSize: 16, lineHeight: 26, marginBottom: 8, color: '#2C3E50' },
});
