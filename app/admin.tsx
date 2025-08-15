import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Image, Modal, Alert, ActivityIndicator,Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, Plus, CreditCard as Edit, Trash2, Save, X, Music, User,
  Album, Clock, Tag, Heart, FileAudio2
} from 'lucide-react-native';

const BACKEND_URL = Platform.select({
  web: 'http://localhost:3001',
  default: 'https://e64e7eaf7862.ngrok-free.app',
});
interface Song {
  //_id: string;
  id: string; // (your app's song id)
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

export default function AdminPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [formData, setFormData] = useState<Partial<Song>>({});
  const [lyricsText, setLyricsText] = useState(''); // for textarea input
  const [saving, setSaving] = useState(false);
  




  // Fetch All Songs
  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/songs`);
      const data = await res.json();
      setSongs(data);
    } catch (err) {
      setSongs([]);
      Alert.alert('Error', 'Failed to fetch songs');
    }
    setLoading(false);
  };
  useEffect(() => { fetchSongs(); }, []);

  // Modal helpers
  const resetForm = () => {
    setFormData({});
    setEditingSong(null);
    setLyricsText('');
  };
  const openAddModal = () => { resetForm(); setShowModal(true); };
  const openEditModal = (song) => {
  setEditingSong(song);
  setFormData({ ...song }); // Set once
  setLyricsText(song.lyrics ? song.lyrics.join('\n') : '');
  setShowModal(true);
};



  const handleSave = async () => {
  // Mandatory fields validation
  if (!formData.title || !formData.artist || !formData.album || !formData.duration ||
      !formData.genre || !formData.audioUrl || !formData.image) {
    Alert.alert('Error', 'Please fill in all required fields');
    return;
  }

  // Process lyrics string to array
  const lyricsArr = lyricsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const songBody = {
    ...formData,
    lyrics: lyricsArr,
    isLiked: formData.isLiked ?? false,
  };

  if (!editingSong && !songBody.id) {
    songBody.id = String(Date.now());
  }

  let method = editingSong ? 'PATCH' : 'POST';
  let url = editingSong ? `${BACKEND_URL}/api/songs/${editingSong._id}` : `${BACKEND_URL}/api/songs`;

  try {
    setSaving(true);

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songBody),
    });

    if (!res.ok) {
      const msg = await res.text();
      Alert.alert('Error', `Failed to save song: ${msg}`);
      return;
    }

    // Refresh songs after successful save
    await fetchSongs();

    // Close modal and reset form
    setShowModal(false);
    resetForm();

  } catch (error) {
    Alert.alert('Error', 'Network error occurred during saving');
  } finally {
    setSaving(false);
  }
};




  // Delete Song
  const handleDelete = (songId: string) => {
    Alert.alert(
      'Delete Song', 'Are you sure you want to delete this song?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            await fetch(`${BACKEND_URL}/api/songs/${songId}`, { method: 'DELETE' });
            fetchSongs();
        } }
      ]
    );
  };

  // Toggle Like
  const toggleLike = async (song: Song) => {
    await fetch(`${BACKEND_URL}/api/songs/${song._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLiked: !song.isLiked }),
    });
    fetchSongs();
  };

  // Add/Edit Modal
  const SongModal = () => (
    <Modal visible={showModal} transparent animationType="slide"
      onRequestClose={() => setShowModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <LinearGradient colors={['#FF6B35', '#FF8C5A']} style={styles.modalHeader} >
            <Text style={styles.modalTitle}>{editingSong ? 'Edit Song' : 'Add New Song'}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </LinearGradient>
          <ScrollView style={styles.modalContent}>
            {[
              { label: 'Song Title *', icon: Music, value: formData.title, key: 'title', placeholder: 'Enter song title' },
              { label: 'Artist *', icon: User, value: formData.artist, key: 'artist', placeholder: 'Enter artist name' },
              { label: 'Album *', icon: Album, value: formData.album, key: 'album', placeholder: 'Enter album name' },
              { label: 'Duration *', icon: Clock, value: formData.duration, key: 'duration', placeholder: 'e.g., 3:28' },
              { label: 'Genre *', icon: Tag, value: formData.genre, key: 'genre', placeholder: 'e.g., Pop, Rock, Electronic' }
            ].map(({ label, icon: Icon, value, key, placeholder }) => (
              <View key={key} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{label}</Text>
                <View style={styles.inputContainer}>
                  <Icon size={20} color="#FF6B35" />
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, [key]: text }))}
                  />
                </View>
              </View>
            ))}
            {/* Audio url */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Audio URL *</Text>
              <View style={styles.inputContainer}>
                <FileAudio2 size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com/song.mp3"
                  value={formData.audioUrl}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, audioUrl: text }))}
                />
              </View>
            </View>
            {/* Image url */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Image URL *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter image URL (required)"
                value={formData.image}
                onChangeText={(text) => setFormData(prev => ({ ...prev, image: text }))}
                multiline
              />
            </View>
            {/* Lyrics textarea */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Lyrics (one line per line)</Text>
              <TextInput
                style={[styles.textArea, { minHeight: 100 }]}
                placeholder="Add song lyrics here (one line per row)"
                value={lyricsText}
                onChangeText={setLyricsText}
                multiline
              />
            </View>

            {/* Modal actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
  style={[styles.saveButton, saving && { opacity: 0.6 }]}
  onPress={handleSave}
  disabled={saving}
>
  {saving ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <>
      <Save size={20} color="#FFF" />
      <Text style={styles.saveButtonText}>Save Song</Text>
    </>
  )}
</TouchableOpacity>

            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // --- UI ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FF6B35', '#FF8C5A']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage your music library</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Plus size={20} color="#FF6B35" />
          <Text style={styles.addButtonText}>Add Song</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{songs.length}</Text>
            <Text style={styles.statLabel}>Total Songs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{new Set(songs.map(s => s.genre)).size}</Text>
            <Text style={styles.statLabel}>Genres</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{new Set(songs.map(s => s.artist)).size}</Text>
            <Text style={styles.statLabel}>Artists</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Songs Library</Text>
        {loading && <ActivityIndicator size="large" color="#FF6B35" />}

        {songs.map((song) => (
          <View key={song._id} style={styles.songCard}>
            <Image source={{ uri: song.image }} style={styles.songImage} />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle}>{song.title}</Text>
              <Text style={styles.songArtist}>{song.artist}</Text>
              <Text style={styles.songDetails}>{song.album} • {song.duration}</Text>
              <Text style={styles.songDetails}>Audio: {song.audioUrl ? '✅' : '❌'}</Text>
              <View style={styles.genreTag}>
                <Text style={styles.genreText}>{song.genre}</Text>
              </View>
            </View>
            <View style={styles.songActions}>
              <TouchableOpacity onPress={() => toggleLike(song)} style={{ padding: 4 }}>
                <Heart
                  size={20}
                  color={song.isLiked ? '#FF6B35' : '#999'}
                  fill={song.isLiked ? '#FF6B35' : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(song)}>
                <Edit size={18} color="#FF6B35" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(song._id)}>
                <Trash2 size={18} color="#DC3545" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>
      <SongModal />
    </View>
  );
}

// --- Use your existing styles block ---


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    color: '#FF6B35',
    fontWeight: '700',
    fontSize: 14,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },

  // Song Cards
  songCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
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
  songDetails: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 6,
  },
  genreTag: {
    backgroundColor: '#FFF5F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  genreText: {
    fontSize: 10,
    color: '#FF6B35',
    fontWeight: '600',
  },
  songActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#FFF5F3',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  textArea: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    gap: 12,
    marginTop: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '600',
  },

  bottomPadding: {
    height: 100,
  },
});