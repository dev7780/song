import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Settings as SettingsIcon, User, Heart, Music, Clock, LogOut, CreditCard as Edit, Star, Headphones, Bell, Volume2, Download, Shield, CircleHelp as HelpCircle, Info, Database, Users, ChartBar as BarChart3, Plus, Trash2 } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [highQualityAudio, setHighQualityAudio] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              // Navigate to home page after successful logout
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  // Handle login navigation
  const handleLogin = () => {
    router.push('/');
  };

  // Handle admin functions
  const handleAdminFunction = (action: string) => {
    switch (action) {
      case 'manage-songs':
        router.push('/admin');
        break;
      case 'view-analytics':
        Alert.alert('Analytics', 'Analytics dashboard would open here');
        break;
      case 'manage-users':
        Alert.alert('User Management', 'User management panel would open here');
        break;
      default:
        Alert.alert('Feature', `${action} feature would open here`);
    }
  };

  // Guest/Not Logged In View
  if (!user) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient colors={['#FF6B35', '#FF8C5A']} style={styles.header}>
          <SettingsIcon size={32} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Login Prompt */}
          <View style={styles.loginPrompt}>
            <User size={48} color="#FF6B35" />
            <Text style={styles.loginPromptTitle}>Sign In Required</Text>
            <Text style={styles.loginPromptText}>
              Please sign in to access your settings and personalize your music experience
            </Text>
            
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Basic Settings (Available to guests) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Settings</Text>
            
            <View style={styles.settingItem}>
              <Volume2 size={20} color="#FF6B35" />
              <Text style={styles.settingText}>High Quality Audio</Text>
              <Switch
                value={highQualityAudio}
                onValueChange={setHighQualityAudio}
                trackColor={{ false: '#E9ECEF', true: '#FFB299' }}
                thumbColor={highQualityAudio ? '#FF6B35' : '#6C757D'}
              />
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <HelpCircle size={20} color="#6C757D" />
              <Text style={styles.settingText}>Help & Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Info size={20} color="#6C757D" />
              <Text style={styles.settingText}>About SoundWave</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Logged In User View
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FF6B35', '#FF8C5A']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userHeaderInfo}>
            <Image source={{ uri: user.avatar }} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerTitle}>{user.name}</Text>
              <Text style={styles.headerSubtitle}>
                {user.type === 'admin' ? 'Administrator' : 'Music Lover'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={() => Alert.alert('Edit Profile', 'Edit profile would open here')}>
            <Edit size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Stats (for both user and admin) */}
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

        {/* Admin-Only Section */}
        {user.type === 'admin' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin Controls</Text>
            
            <TouchableOpacity 
              style={styles.adminItem}
              onPress={() => handleAdminFunction('manage-songs')}
            >
              <Database size={20} color="#FF6B35" />
              <Text style={styles.settingText}>Manage Songs</Text>
              <Text style={styles.adminBadge}>CRUD</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.adminItem}
              onPress={() => handleAdminFunction('manage-users')}
            >
              <Users size={20} color="#FF6B35" />
              <Text style={styles.settingText}>Manage Users</Text>
              <Text style={styles.adminBadge}>Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.adminItem}
              onPress={() => handleAdminFunction('view-analytics')}
            >
              <BarChart3 size={20} color="#FF6B35" />
              <Text style={styles.settingText}>Analytics Dashboard</Text>
              <Text style={styles.adminBadge}>Stats</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* User Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <Bell size={20} color="#FF6B35" />
            <Text style={styles.settingText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E9ECEF', true: '#FFB299' }}
              thumbColor={notificationsEnabled ? '#FF6B35' : '#6C757D'}
            />
          </View>

          <View style={styles.settingItem}>
            <Download size={20} color="#FF6B35" />
            <Text style={styles.settingText}>Auto Download</Text>
            <Switch
              value={autoDownload}
              onValueChange={setAutoDownload}
              trackColor={{ false: '#E9ECEF', true: '#FFB299' }}
              thumbColor={autoDownload ? '#FF6B35' : '#6C757D'}
            />
          </View>

          <View style={styles.settingItem}>
            <Volume2 size={20} color="#FF6B35" />
            <Text style={styles.settingText}>High Quality Audio</Text>
            <Switch
              value={highQualityAudio}
              onValueChange={setHighQualityAudio}
              trackColor={{ false: '#E9ECEF', true: '#FFB299' }}
              thumbColor={highQualityAudio ? '#FF6B35' : '#6C757D'}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/songs')}
          >
            <Heart size={20} color="#FF6B35" />
            <Text style={styles.settingText}>Liked Songs</Text>
            <Text style={styles.countBadge}>{user.stats.likedSongs}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Music size={20} color="#FF6B35" />
            <Text style={styles.settingText}>My Playlists</Text>
            <Text style={styles.countBadge}>{user.stats.playlists}</Text>
          </TouchableOpacity>
        </View>

        {/* Support & Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Info</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <HelpCircle size={20} color="#6C757D" />
            <Text style={styles.settingText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Info size={20} color="#6C757D" />
            <Text style={styles.settingText}>About SoundWave</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Shield size={20} color="#6C757D" />
            <Text style={styles.settingText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.logoutItem, isLoggingOut && styles.logoutItemDisabled]} 
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut size={20} color={isLoggingOut ? '#999' : '#DC3545'} />
            <Text style={[styles.logoutText, isLoggingOut && styles.logoutTextDisabled]}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Content
  content: {
    flex: 1,
  },

  // Login Prompt (Guest View)
  loginPrompt: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  loginPromptTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  loginPromptText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 32,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
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

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },

  // Setting Items
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 12,
  },

  // Admin Items
  adminItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF5F3',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFB299',
  },
  adminBadge: {
    backgroundColor: '#FF6B35',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    textTransform: 'uppercase',
  },

  // Count Badge
  countBadge: {
    backgroundColor: '#E9ECEF',
    color: '#6C757D',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  // Logout
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEBEE',
  },
  logoutItemDisabled: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E9ECEF',
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC3545',
    marginLeft: 12,
  },
  logoutTextDisabled: {
    color: '#999',
  },

  bottomPadding: {
    height: 100,
  },
});