import { useState, useRef, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { Audio } from 'expo-av';

export default function AudioPlayer({ uri, title }: { uri: string; title: string }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // unload on mount/unmount (hot-reload safe)
    soundRef.current?.unloadAsync();
    return () => {
      // don't return the Promise from the cleanup; call it but ignore the Promise
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  async function toggle() {
    if (!soundRef.current) {
      // create paused, play only when pressed
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );
      soundRef.current = sound;
      await sound.playAsync();
      setPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) setPlaying(false);
      });
    } else {
      const s = await soundRef.current.getStatusAsync();
      if ('isPlaying' in s && s.isPlaying) {
        await soundRef.current.pauseAsync();
        setPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setPlaying(true);
      }
    }
  }

  return (
    <View style={{ marginVertical: 8, alignItems: 'center' }}>
      <Text style={{ color: '#0ff', marginBottom: 6 }}>{title}</Text>
      <Button title={playing ? 'Pause' : 'Play'} onPress={toggle} />
    </View>
  );
}
