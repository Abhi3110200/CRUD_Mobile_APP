import { useEffect, useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { commonStyles, colors, typography, noteColors } from "../../constants/styles";
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditNote() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(noteColors[0]);
    const router = useRouter();

    const API_URL = "http://192.168.1.105:8000";

    useEffect(() => {
        const loadNote = async () => {
            try {
                setError(null);
                const response = await fetch(`${API_URL}/notes/${id}`);
                if (!response.ok) throw new Error('Failed to load note');
                const data = await response.json();
                setTitle(data.title);
                setContent(data.content || '');
                if (data.color) {
                    setSelectedColor(data.color);
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load note';
                setError(errorMessage);
                console.error('Error loading note:', err);
            } finally {
                setLoading(false);
            }
        };

        loadNote();
    }, [id]);

    const updateNote = async () => {
        if (!title.trim() || !content.trim()) {
            setError('Both title and content are required');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            try {
                const response = await fetch(`${API_URL}/notes/${id}`, {
                    method: "PUT",
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

                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.message || 'Failed to update note');
                }

                if (!result.success) {
                    throw new Error(result.message || 'Failed to update note');
                }

                // Navigate back to home on success
                router.back();
            } catch (err: unknown) {
                console.error('Error updating note:', err);
                const errorMessage = err instanceof Error ? err.message : 'Failed to update note. Please try again.';
                setError(errorMessage);
            } finally {
                setSaving(false);
            }
        } catch (err: unknown) {
            console.error('Error updating note:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to update note. Please try again.';
            setError(errorMessage);
        }
    };

    if (loading) {
        return (
            <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

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
                            <Text style={[commonStyles.errorText, { marginBottom: 16 }]}>{error}</Text>
                        )}

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

                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                            <TouchableOpacity
                                style={[
                                    commonStyles.button,
                                    {
                                        flex: 1,
                                        backgroundColor: '#f5f5f5',
                                        opacity: saving ? 0.6 : 1
                                    }
                                ]}
                                onPress={() => router.back()}
                                disabled={saving}
                            >
                                <Text style={[commonStyles.buttonText, { color: colors.text }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    commonStyles.button,
                                    {
                                        flex: 2,
                                        opacity: (!title.trim() || !content.trim() || saving) ? 0.6 : 1
                                    }
                                ]}
                                onPress={updateNote}
                                disabled={!title.trim() || !content.trim() || saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={commonStyles.buttonText}>Update Note</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
