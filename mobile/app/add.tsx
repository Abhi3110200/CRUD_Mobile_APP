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
import { commonStyles, colors, typography } from "../constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddNote() {
  const [title, setTitle] = useState("");   
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
          content: content.trim() 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save note');
      }
      
      // Navigate back to home on success
      router.replace("/");
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
    //   keyboardVerticalOffset={90}
    >
        <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        style={commonStyles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={{ marginBottom: 24 }}>
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

          {error && (
            <View style={{ 
              backgroundColor: '#ffebee', 
              padding: 12, 
              borderRadius: 8, 
              marginTop: 8 
            }}>
              <Text style={{ color: colors.error, textAlign: 'center' }}>{error}</Text>
            </View>
          )}

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
