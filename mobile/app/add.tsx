import { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  ActivityIndicator, 
} from "react-native";
import { useRouter } from "expo-router";
import { commonStyles, colors, typography, noteColors } from "../constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddNote() {
  const [title, setTitle] = useState("");   
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(noteColors[0]);
  const router = useRouter();

  const API_URL = "http://192.168.1.105:8000"; // replace with your system IP

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim(), 
          content: content.trim(), 
          color: selectedColor,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save note');
      }
      
      // Navigate back to home on success
      router.back();
    } catch (err: unknown) {
      console.error('Error saving note:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save note. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        style={commonStyles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={{ marginBottom: 24 }}>
          <Text style={[typography.h2, { marginBottom: 16 }]}>New Note</Text>

          {error && (
            <Text style={[commonStyles.errorText, { marginBottom: 16 }]}>{error}</Text>
          )}

          <TextInput
            placeholder="Note Title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (error) setError(null);
            }}
            style={[
              commonStyles.input,
              error && !title.trim() && { borderColor: colors.error }
            ]}
            maxLength={100}
            autoFocus
          />
          
          <TextInput
            placeholder="Start writing your note..."
            placeholderTextColor="#999"
            value={content}
            onChangeText={(text) => {
              setContent(text);
              if (error) setError(null);
            }}
            multiline
            style={[
              commonStyles.input,
              { 
                minHeight: 200, 
                textAlignVertical: 'top',
                paddingTop: 16,
                lineHeight: 22
              },
              error && !content.trim() && { borderColor: colors.error }
            ]}
            scrollEnabled
          />

          <Text style={[typography.body, { marginBottom: 8 }]}>Choose a color:</Text>
          <View style={commonStyles.colorPicker}>
            {noteColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  commonStyles.colorOption,
                  selectedColor === color && commonStyles.colorOptionSelected,
                  { backgroundColor: color }
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              commonStyles.button,
              { 
                marginTop: 24,
                opacity: (!title.trim() || !content.trim() || loading) ? 0.6 : 1 
              }
            ]}
            onPress={saveNote}
            disabled={!title.trim() || !content.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={commonStyles.buttonText}>Save Note</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
