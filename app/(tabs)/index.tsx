import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Play,
  Music,
  Headphones,
  Radio,
  Heart,
  Users,
  Zap,
  Download,
  Lock,
  User,
  Eye,
  EyeOff,
  X,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function MusicAppIntro() {
  const router = useRouter();
  const { user, login } = useAuth();
  
  // State management for login modal and form
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // App features data
  const features = [
    {
      icon: Music,
      title: 'Unlimited Music',
      description: 'Access millions of songs from your favorite artists worldwide',
    },
    {
      icon: Headphones,
      title: 'High Quality Audio',
      description: 'Crystal clear sound with lossless audio streaming',
    },
    {
      icon: Radio,
      title: 'Live Radio',
      description: 'Tune into live radio stations from around the globe',
    },
    {
      icon: Download,
      title: 'Offline Listening',
      description: 'Download your favorite tracks for offline enjoyment',
    },
  ];

  // App statistics data
  const stats = [
    { number: '50M+', label: 'Songs' },
    { number: '2M+', label: 'Artists' },
    { number: '10M+', label: 'Users' },
    { number: '180+', label: 'Countries' },
  ];

  // Navigate to songs page
  const navigateToSongs = useCallback(() => {
    router.push('/songs');
  }, [router]);

  // Handle login form submission
  const handleLogin = useCallback(async () => {
    // Clear any previous error messages
    setLoginError('');
    setIsLoggingIn(true);
    
    // Validate that both username and password are provided
    if (!username.trim() || !password.trim()) {
      setLoginError('Please enter both username and password');
      setIsLoggingIn(false);
      return;
    }
    
    try {
      const success = await login(username.trim(), password.trim());
      
      if (success) {
        // Login successful - close modal and reset form
        setShowLoginModal(false);
        setLoginError('');
        setUsername('');
        setPassword('');
        setShowPassword(false);
        
        // Navigate based on user type will be handled by the auth context
        // The user object will be available globally now
      } else {
        // Login failed - show error message
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  }, [username, password, login]);

  // Close login modal and reset all form data
  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
    setLoginError('');
    setUsername('');
    setPassword('');
    setShowPassword(false);
  }, []);

  // Open login modal
  const openLoginModal = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section with Background Image */}
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        }}
        style={styles.heroSection}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(255, 107, 53, 0.8)',
            'rgba(255, 107, 53, 0.9)',
            'rgba(255, 107, 53, 0.95)',
          ]}
          style={styles.heroOverlay}
        >
          {/* Login Button in Top Right Corner - Show different text based on login status */}
          <TouchableOpacity
            style={styles.loginHeaderButton}
            onPress={user ? () => router.push('/settings') : openLoginModal}
            activeOpacity={0.8}
          >
            {user ? (
              <>
                <User size={16} color="#FF6B35" />
                <Text style={styles.loginHeaderButtonText}>Profile</Text>
              </>
            ) : (
              <>
                <Lock size={16} color="#FF6B35" />
                <Text style={styles.loginHeaderButtonText}>Login</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            {/* App Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Music size={40} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </View>

            {/* App Title and Description */}
            <Text style={styles.heroTitle}>SoundWave</Text>
            <Text style={styles.heroSubtitle}>
              Your Ultimate Music Experience
            </Text>
            <Text style={styles.heroDescription}>
              Discover, stream, and enjoy millions of songs from artists around
              the world. Your music journey starts here.
            </Text>

            {/* Welcome message if user is logged in */}
            {user && (
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
              </View>
            )}

            {/* Main Call-to-Action Button */}
            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.8}
              onPress={navigateToSongs}
            >
              <Play size={20} color="#FF6B35" fill="#FF6B35" />
              <Text style={styles.ctaButtonText}>Start Listening</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Trusted by Music Lovers Worldwide</Text>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose SoundWave?</Text>
        <Text style={styles.sectionDescription}>
          Experience music like never before with our premium features
        </Text>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <feature.icon size={28} color="#FF6B35" strokeWidth={2} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Music Genres Section */}
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        }}
        style={styles.genresSection}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.7)', 'rgba(255, 107, 53, 0.8)']}
          style={styles.genresOverlay}
        >
          <Text style={styles.genresTitle}>Every Genre, Every Mood</Text>
          <Text style={styles.genresDescription}>
            From classical symphonies to the latest pop hits, discover music
            that moves your soul
          </Text>

          <View style={styles.genresList}>
            {['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic'].map(
              (genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              )
            )}
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Community Section */}
      <View style={styles.communitySection}>
        <View style={styles.communityContent}>
          <Users size={40} color="#FF6B35" strokeWidth={2} />
          <Text style={styles.communityTitle}>Join the Community</Text>
          <Text style={styles.communityDescription}>
            Connect with fellow music enthusiasts, share playlists, and discover
            new favorites together
          </Text>

          <View style={styles.communityFeatures}>
            <View style={styles.communityFeature}>
              <Heart size={20} color="#FF6B35" />
              <Text style={styles.communityFeatureText}>Share Favorites</Text>
            </View>
            <View style={styles.communityFeature}>
              <Zap size={20} color="#FF6B35" />
              <Text style={styles.communityFeatureText}>Live Sessions</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Final Call-to-Action */}
      <View style={styles.finalCTA}>
        <LinearGradient
          colors={['#FF6B35', '#FF8C5A']}
          style={styles.finalCTAGradient}
        >
          <Text style={styles.finalCTATitle}>Ready to Rock?</Text>
          <Text style={styles.finalCTADescription}>
            Start your musical journey today and unlock a world of endless
            entertainment
          </Text>

          <TouchableOpacity
            style={styles.finalCTAButton}
            activeOpacity={0.8}
            onPress={navigateToSongs}
          >
            <Text style={styles.finalCTAButtonText}>Get Started Free</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Login Modal - Only show if user is not logged in */}
      {!user && (
        <Modal
          visible={showLoginModal}
          transparent={true}
          animationType="slide"
          onRequestClose={closeLoginModal}
          statusBarTranslucent={true}
        >
          <KeyboardAvoidingView 
            style={styles.modalContainer} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1}
              onPress={closeLoginModal}
            >
              <TouchableOpacity 
                style={styles.loginModal} 
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <LinearGradient
                  colors={['#FF6B35', '#FF8C5A']}
                  style={styles.loginHeader}
                >
                  <View style={styles.headerContent}>
                    <Lock size={32} color="#FFFFFF" />
                    <Text style={styles.loginTitle}>Login</Text>
                    <Text style={styles.loginSubtitle}>Access your account</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={closeLoginModal}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <X size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </LinearGradient>

                {/* Login Form */}
                <View style={styles.loginForm}>
                  {/* Username Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={styles.inputContainer}>
                      <User size={20} color="#FF6B35" />
                      <TextInput
                        style={styles.loginInput}
                        placeholder="Enter your username"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        editable={!isLoggingIn}
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputContainer}>
                      <Lock size={20} color="#FF6B35" />
                      <TextInput
                        style={styles.loginInput}
                        placeholder="Enter your password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                        blurOnSubmit={false}
                        editable={!isLoggingIn}
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={togglePasswordVisibility}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        disabled={isLoggingIn}
                      >
                        {showPassword ? (
                          <EyeOff size={20} color="#999" />
                        ) : (
                          <Eye size={20} color="#999" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Error Message */}
                  {loginError ? (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{loginError}</Text>
                    </View>
                  ) : null}

                  {/* Action Buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.loginButton, isLoggingIn && styles.loginButtonDisabled]}
                      onPress={handleLogin}
                      activeOpacity={0.8}
                      disabled={isLoggingIn}
                    >
                      <Text style={styles.loginButtonText}>
                        {isLoggingIn ? 'Logging in...' : 'Login'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={closeLoginModal}
                      activeOpacity={0.8}
                      disabled={isLoggingIn}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Demo Credentials Help */}
                  <View style={styles.credentialsHelp}>
                    <Text style={styles.credentialsTitle}>Demo Accounts:</Text>
                    <View style={styles.credentialsList}>
                      <Text style={styles.credentialsHint}>
                        Admin: admin / admin123
                      </Text>
                      <Text style={styles.credentialsHint}>
                        User: user / user123
                      </Text>
                      <Text style={styles.credentialsHint}>
                        Demo: demo / demo123
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Login Header Button
  loginHeaderButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginHeaderButtonText: {
    color: '#FF6B35',
    fontWeight: '600',
    fontSize: 14,
  },

  // Welcome Container
  welcomeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  // Modal Header
  loginHeader: {
    position: 'relative',
    padding: 24,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    gap: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  // Form Styles
  loginForm: {
    padding: 24,
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
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  loginInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
    minHeight: 20,
  },
  eyeButton: {
    padding: 4,
    borderRadius: 12,
  },

  // Error Message
  errorContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: '#DC3545',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEBEE',
  },

  // Buttons
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#FFB299',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  cancelButtonText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '600',
  },

  // Demo Credentials
  credentialsHelp: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  credentialsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  credentialsList: {
    gap: 6,
  },
  credentialsHint: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },

  // Hero Section
  heroSection: {
    height: height * 0.75,
    width: '100%',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.95,
  },
  heroDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.9,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
    marginLeft: 8,
  },

  // Stats Section
  statsSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: '#F8F9FA',
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: width / 4 - 20,
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },

  // Features Section
  featuresSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: width < 768 ? '100%' : '48%',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF5F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },

  // Genres Section
  genresSection: {
    height: 300,
    width: '100%',
  },
  genresOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  genresTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  genresDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 24,
  },
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  genreTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  genreText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  // Community Section
  communitySection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: '#F8F9FA',
  },
  communityContent: {
    alignItems: 'center',
    maxWidth: 400,
    alignSelf: 'center',
  },
  communityTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  communityDescription: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  communityFeatures: {
    flexDirection: 'row',
    gap: 32,
  },
  communityFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  communityFeatureText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },

  // Final CTA
  finalCTA: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  finalCTAGradient: {
    padding: 32,
    alignItems: 'center',
  },
  finalCTATitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  finalCTADescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 24,
  },
  finalCTAButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  finalCTAButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
});