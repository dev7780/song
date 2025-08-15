const mongoose = require('mongoose');
const Song = require('./models/Songs'); // Adjust path if needed

// Replace with your real connection string
const MONGO_URI = 'mongodb+srv://devanshuraj767:xR13LdlhbEkmuq3X@cluster0.aafacta.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Mongo connection error:', err));

const audioUrls = {
  '1': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  '2': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  '3': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  '4': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  '5': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  '6': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  '7': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  '8': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
};

async function main() {
  for (const id in audioUrls) {
    console.log(`Updating song ${id}`);
    await Song.updateOne(
      { id },
      { $set: { audioUrl: audioUrls[id] } }
    );
  }

  console.log('All songs updated with audioUrl 👍');
  mongoose.disconnect();
}

main();
