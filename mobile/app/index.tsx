import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { commonStyles, colors, typography } from "../constants/styles";
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const API_URL = "http://192.168.1.105:8000"; // replace with your system IP

  const loadNotes = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/notes`);
      const data = await response.json();
      setNotes(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notes';
      setError(errorMessage);
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, { 
        method: "DELETE" 
      });
      if (!response.ok) throw new Error('Failed to delete note');
      loadNotes();
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotes();
  };

  useEffect(() => {
    loadNotes();
  }, []);

  if (loading) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
        <Text style={typography.h1}>My Notes</Text>
        <TouchableOpacity 
          style={[commonStyles.button, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }]}
          onPress={() => router.push("/add")}
        >
          <FontAwesome name="plus" size={16} color="white" style={{ marginRight: 8 }} />
          <Text style={commonStyles.buttonText}>Add Note</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={{ backgroundColor: '#ffebee', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ color: colors.error, textAlign: 'center' }}>{error}</Text>
        </View>
      )}

      <FlatList
        data={notes}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: colors.text, opacity: 0.6 }}>No notes yet. Tap + to add one!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={commonStyles.card}>
            <TouchableOpacity onPress={() => router.push(`/edit/${item._id}`)}>
              <Text style={[typography.h2, { marginBottom: 8 }]}>{item.title}</Text>
              <Text 
                style={[typography.body, { color: '#666', marginBottom: 12 }]}
                numberOfLines={3}
              >
                {item.content}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#888', fontSize: 12 }}>
                  {new Date(item.updatedAt).toLocaleDateString()}
                </Text>
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    deleteNote(item._id);
                  }}
                  style={{ padding: 8 }}
                >
                  <FontAwesome name="trash" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
