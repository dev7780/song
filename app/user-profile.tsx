import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Heart, Music, Clock, Settings, LogOut, CreditCard as Edit, Star, Headphones } from 'lucide-react-native';

// Hardcoded user data for demo - in real app this would come from authentication state
const USER_DATA = {
  name: 'John Doe',
  username: 'user',
  email: 'john.doe@example.com',
  joinDate: 'January 2024',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
  stats: {
    songsPlayed: 1247,
    hoursListened: 156,
    likedSongs: 89,
    playlists: 12,
  },
  recentlyPlayed: [
    {
      id: '1',
      title: 'Midnight Dreams',
      artist: 'Luna Eclipse',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      title: 'Ocean Waves',
      artist: 'Coastal Harmony',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '3',
      title: 'City Lights',
      artist: 'Urban Pulse',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ],
};

export default function UserProfile() {
  const router = useRouter();
  const [user] = useState(USER_DATA);

  // Handle logout - navigate back to home page
  const handleLogout = () => {
    // In a real app, you would clear authentication state here
    router.push('/');
  };

  // Handle edit profile - placeholder for future functionality
  const handleEditProfile = () => {
    // In a real app, this would open an edit profile modal/page
    console.log('Edit profile pressed');
  };

  // Navigate to songs page
  const navigateToSongs = () => {
    router.push('/songs');
  };

  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <LinearGradient colors={['#FF6B35', '#FF8C5A']} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Edit size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          {/* Profile Picture with online indicator */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.onlineIndicator} />
          </View>

          {/* User Details */}
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userUsername}>@{user.username}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
        </View>

        {/* Stats Section - Shows user's music listening statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Music Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Music size={24} color="#FF6B35" />
              <Text style={styles.statNumber}>{user.stats.songsPlayed}</Text>
              <Text style={styles.statLabel}>Songs Played</Text>
            </View>
            
            <View style={styles.statCard}>
              <Clock size={24} color="#FF6B35" />
              <Text style={styles.statNumber}>{user.stats.hoursListened}h</Text>
              <Text style={styles.statLabel}>Hours Listened</Text>
            </View>
            
            <View style={styles.statCard}>
              <Heart size={24} color="#FF6B35" />
              <Text style={styles.statNumber}>{user.stats.likedSongs}</Text>
              <Text style={styles.statLabel}>Liked Songs</Text>
            </View>
            
            <View style={styles.statCard}>
              <Star size={24} color="#FF6B35" />
              <Text style={styles.statNumber}>{user.stats.playlists}</Text>
              <Text style={styles.statLabel}>Playlists</Text>
            </View>
          </View>
        </View>

        {/* Recently Played Section */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recently Played</Text>
          
          {user.recentlyPlayed.map((song) => (
            <View key={song.id} style={styles.recentSongItem}>
              <Image source={{ uri: song.image }} style={styles.recentSongImage} />
              <View style={styles.recentSongInfo}>
                <Text style={styles.recentSongTitle}>{song.title}</Text>
                <Text style={styles.recentSongArtist}>{song.artist}</Text>
              </View>
              <TouchableOpacity 
                style={styles.playAgainButton}
                onPress={() => router.push(`/song-detail?id=${song.id}`)}
              >
                <Headphones size={20} color="#FF6B35" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={navigateToSongs}
          >
            <Heart size={20} color="#FF6B35" />
            <Text style={styles.actionText}>Liked Songs</Text>
            <Text style={styles.actionCount}>{user.stats.likedSongs}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Music size={20} color="#FF6B35" />
            <Text style={styles.actionText}>My Playlists</Text>
            <Text style={styles.actionCount}>{user.stats.playlists}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Settings size={20} color="#6C757D" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <LogOut size={20} color="#DC3545" />
            <Text style={[styles.actionText, { color: '#DC3545' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Content Styles
  content: {
    flex: 1,
  },

  // User Info Section Styles
  userInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#28A745',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 12,
    color: '#6C757D',
  },

  // Stats Section Styles
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C3E50',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Recently Played Section Styles
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  recentSongItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  recentSongImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  recentSongInfo: {
    flex: 1,
  },
  recentSongTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  recentSongArtist: {
    fontSize: 14,
    color: '#6C757D',
  },
  playAgainButton: {
    padding: 8,
    backgroundColor: '#FFF5F3',
    borderRadius: 20,
    marginRight: 8,
  },

  // Actions Section Styles
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 12,
  },
  actionCount: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '600',
  },
});