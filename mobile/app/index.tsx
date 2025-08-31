import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, TextInput } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { commonStyles, colors, typography } from "../constants/styles";
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
      setFilteredNotes(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notes';
      setError(errorMessage);
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showDeleteConfirmation = (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteNote(id)
        }
      ]
    );
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

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

      {/* Search Bar */}
      <View style={[commonStyles.searchContainer]}>
        <View style={commonStyles.searchInnerContainer}>
          <FontAwesome name="search" size={16} color="#888" style={{ marginRight: 10 }} />
          <TextInput
            style={commonStyles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            clearButtonMode="while-editing"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {error && (
        <View style={{ backgroundColor: '#ffebee', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ color: colors.error, textAlign: 'center' }}>{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredNotes}
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
          <View style={[
            commonStyles.card, 
            { 
              backgroundColor: item.color || colors.card,
              borderLeftWidth: 4,
              borderLeftColor: item.color ? `${item.color}99` : colors.primary,
              marginBottom: 12,
              elevation: 2,
              padding: 16,
              borderRadius: 12,
            }
          ]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity 
                onPress={() => router.push(`/edit/${item._id}`)}
                style={{ flex: 1 }}
              >
                <Text style={[typography.h2, { marginBottom: 8 }]}>{item.title}</Text>
                <Text 
                  style={[
                    typography.body, 
                    { 
                      color: item.color ? '#333' : colors.text,
                      opacity: 0.9 
                    }
                  ]} 
                  numberOfLines={2}
                >
                  {item.content}
                </Text>
              </TouchableOpacity>
            
              <TouchableOpacity
                onPress={() => showDeleteConfirmation(item._id)}
                style={{ padding: 8 }}
              >
                <FontAwesome name="trash" size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
            <Text style={[typography.body, { 
                color: colors.text, 
                opacity: 0.6,
                fontSize: 12,
                marginTop: 8
              }]}>
                {item.updatedAt ? new Date(item.updatedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : ''}
              </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
