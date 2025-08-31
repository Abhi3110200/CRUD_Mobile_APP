import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { FontAwesome } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import type { Note } from "../../types/note"

const { width, height } = Dimensions.get("window")

export default function ViewNote() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const API_URL = "http://192.168.1.105:8000"

  // Enhanced animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const headerAnim = useRef(new Animated.Value(-100)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [])

  useEffect(() => {
    const loadNote = async () => {
      try {
        setError(null)
        const response = await fetch(`${API_URL}/notes/${id}`)
        if (!response.ok) throw new Error("Failed to load note")
        const data = await response.json()
        setNote(data)
      } catch (err: any) {
        setError(err.message || "Failed to load note")
      } finally {
        setLoading(false)
      }
    }
    loadNote()
  }, [id])

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete note")
      router.back()
    } catch (err: any) {
      setError(err.message || "Failed to delete note")
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: handleDelete },
    ])
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.loadingGradient}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading your note...</Text>
        </LinearGradient>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient colors={["#ff6b6b", "#ee5a52"]} style={styles.errorGradient}>
          <FontAwesome name="exclamation-triangle" size={48} color="white" />
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }

  if (!note) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient colors={["#a8a8a8", "#8a8a8a"]} style={styles.errorGradient}>
          <FontAwesome name="file-text-o" size={48} color="white" />
          <Text style={styles.errorTitle}>Note Not Found</Text>
          <Text style={styles.errorMessage}>The note you're looking for doesn't exist.</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Enhanced Header with better gradient and animations */}
      <Animated.View style={[styles.headerContainer, { transform: [{ translateY: headerAnim }] }]}>
        <LinearGradient
          colors={["#667eea", "#764ba2", "#667eea"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.headerButton} activeOpacity={0.7}>
                <FontAwesome name="arrow-left" size={20} color="white" />
              </TouchableOpacity>

              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Note Details</Text>
                <Text style={styles.headerSubtitle}>Tap to edit or delete</Text>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={() => router.push(`/edit/${id}`)}
                  style={[styles.headerButton, styles.editButton]}
                  activeOpacity={0.7}
                >
                  <FontAwesome name="edit" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmDelete}
                  style={[styles.headerButton, styles.deleteButton]}
                  activeOpacity={0.7}
                >
                  <FontAwesome name="trash" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      {/* Enhanced Note Card with better styling */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={[styles.noteCard, { backgroundColor: note.color || "#ffffff" }]}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={true}>
            {/* Note Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.noteTitle} numberOfLines={3}>
                {note.title}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Note Content */}
            <View style={styles.contentSection}>
              <Text style={styles.noteContent}>{note.content}</Text>
            </View>

            {/* Enhanced Footer with better styling */}
            {note.updatedAt && (
              <View style={styles.footer}>
                <View style={styles.timestampContainer}>
                  <FontAwesome name="clock-o" size={16} color="#6b7280" />
                  <Text style={styles.timestampLabel}>Last updated</Text>
                </View>
                <Text style={styles.timestampText}>
                  {new Date(note.updatedAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  // Loading States
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
  },

  // Error States
  errorContainer: {
    flex: 1,
  },
  errorGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  errorButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Header Styles
  headerContainer: {
    zIndex: 10,
  },
  headerGradient: {
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    backgroundColor: "rgba(52, 211, 153, 0.2)",
  },
  deleteButton: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
  },

  // Content Styles
  contentContainer: {
    flex: 1,
    marginTop: -10,
  },
  noteCard: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },

  // Title Section
  titleContainer: {
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    lineHeight: 36,
    letterSpacing: -0.5,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: 24,
    opacity: 0.6,
  },

  // Content Section
  contentSection: {
    marginBottom: 32,
  },
  noteContent: {
    fontSize: 17,
    lineHeight: 26,
    color: "#374151",
    fontWeight: "400",
    letterSpacing: 0.2,
  },

  // Footer
  footer: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  timestampLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginLeft: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timestampText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
})
