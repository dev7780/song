require('dotenv').config(); // optional, if you're using .env for MONGO_URI
const mongoose = require('mongoose');
const Song = require('./models/Songs');

const hardcodedSongs = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    album: 'Nocturnal Vibes',
    duration: '3:42',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    genre: 'Electronic',
    isLiked: true,
  },
  {
    id: '2',
    title: 'Ocean Waves',
    artist: 'Coastal Harmony',
    album: 'Seaside Sessions',
    duration: '4:15',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    genre: 'Ambient',
    isLiked: false,
  },
  {
    id: '3',
    title: 'City Lights',
    artist: 'Urban Pulse',
    album: 'Metropolitan',
    duration: '3:28',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    genre: 'Pop',
    isLiked: true,
  },
  {
    id: '4',
    title: 'Mountain High',
    artist: 'Alpine Sound',
    album: 'Peak Experience',
    duration: '5:03',
    image: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800',
    genre: 'Rock',
    isLiked: false,
  },
  {
    id: '5',
    title: 'Golden Hour',
    artist: 'Sunset Collective',
    album: 'Warm Memories',
    duration: '3:56',
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800',
    genre: 'Indie',
    isLiked: true,
  },
  {
    id: '6',
    title: 'Neon Nights',
    artist: 'Synthwave Masters',
    album: 'Retro Future',
    duration: '4:22',
    image: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=800',
    genre: 'Synthwave',
    isLiked: false,
  },
  {
    id: '7',
    title: 'Forest Whispers',
    artist: "Nature's Symphony",
    album: 'Woodland Tales',
    duration: '6:18',
    image: 'https://images.pexels.com/photos/1496372/pexels-photo-1496372.jpeg?auto=compress&cs=tinysrgb&w=800',
    genre: 'Ambient',
    isLiked: true,
  },
  {
    id: '8',
    title: 'Electric Storm',
    artist: 'Thunder Bay',
    album: 'Weather Patterns',
    duration: '3:33',
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
    genre: 'Electronic',
    isLiked: false,
  },
];

const sampleLyrics = {
  '1': [
    'In the silence of the midnight hour',
    'Dreams unfold like blooming flowers',
    'Electric pulses through the night',
    'Dancing shadows in neon light',
    '',
    'Midnight dreams are calling me',
    'To a world where I am free',
    "Luna's glow lights up the way",
    'Till the breaking of the day',
  ],
  '2': [
    'Gentle waves upon the shore',
    'Whisper secrets from before',
    "Ocean's rhythm soothes the soul",
    'Makes the broken spirit whole',
    '',
    'Coastal harmony surrounds',
    "Nature's most enchanting sounds",
    'Seagulls dancing in the breeze',
    'Swaying palms and rustling trees',
  ],
  '3': [
    'City lights illuminate the night',
    'Urban pulse beats strong and bright',
    'Streets alive with energy',
    "This is where I'm meant to be",
    '',
    'Neon signs and busy crowds',
    'Music playing clear and loud',
    'Metropolitan symphony',
    "City's calling out to me",
  ],
};

const songsWithLyrics = hardcodedSongs.map(song => ({
  ...song,
  lyrics: sampleLyrics[song.id] || [],
}));

async function seedDatabase() {
  try {
    const MONGO_URI =
      process.env.MONGO_URI ||
      'mongodb+srv://<username>:<password>@cluster0.mongodb.net/musicDB?retryWrites=true&w=majority';

    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Song.deleteMany({}); // Clears existing songs (optional, for reset)
    await Song.insertMany(songsWithLyrics);

    console.log('Seeded songs successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding songs:', err);
    process.exit(1);
  }
}

seedDatabase();
