import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../../src/lib/supabaseClient';
import AudioPlayer from '../../components/AudioPlayer';

type Track = {
  id: string;
  title: string;
  video_url: string;
  artist?: string;
  created_at?: string;
};

export default function IndexScreen() {
  const [tracks, settracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('tracks')
          .select('id,title,video_url,artist,created_at')
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) throw error;
        settracks(data ?? []);
      } catch (e: any) {
        console.error(e);
        setErr(e.message ?? 'Network request failed');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex:1, backgroundColor:'#000', alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator size="large" color="#0ff" />
        <Text style={{ color:'#0ff', marginTop:10 }}>Loading tracks…</Text>
      </View>
    );
  }

  if (err) {
    return (
      <View style={{ flex:1, backgroundColor:'#000', alignItems:'center', justifyContent:'center', padding:20 }}>
        <Text style={{ color:'#f55', textAlign:'center' }}>{err}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex:1, backgroundColor:'#000', paddingTop:16 }}>
      <Text style={{ color:'#0ff', fontSize:22, fontWeight:'800', textAlign:'center', marginBottom:8 }}>
        Discover 🔥
      </Text>

      <FlatList
        contentContainerStyle={{ paddingBottom:24 }}
        data={tracks}
        keyExtractor={(t) => t.id}
        ListEmptyComponent={<Text style={{ color:'#888', textAlign:'center', marginTop:24 }}>No tracks yet.</Text>}
        renderItem={({ item }) => (
          <View style={{ alignItems:'center', marginVertical:8 }}>
            <AudioPlayer
              uri={item.video_url}
              title={`${item.title}${item.artist ? ' – ' + item.artist : ''}`}
            />
          </View>
        )}
      />
    </View>
  );
}
