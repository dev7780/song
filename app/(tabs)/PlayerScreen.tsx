import { useLocalSearchParams } from 'expo-router';

const PlayerScreen = () => {
  const { songId } = useLocalSearchParams();
  // fetch or use songId
};
