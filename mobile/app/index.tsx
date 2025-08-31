"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
} from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import { commonStyles, colors, typography } from "../constants/styles"
import { FontAwesome } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Home() {
  const [notes, setNotes] = useState<any[]>([])
  const [filteredNotes, setFilteredNotes] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const API_URL = "http://192.168.1.105:8000" // replace with your system IP

  const loadNotes = async () => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/notes`)
      const data = await response.json()
      setNotes(data)
      setFilteredNotes(data)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load notes"
      setError(errorMessage)
      console.error("Error loading notes:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const showDeleteConfirmation = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteNote(id),
      },
    ])
  }

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete note")
      loadNotes()
    } catch (err) {
      setError("Failed to delete note")
      console.error("Error deleting note:", err)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadNotes()
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredNotes(notes)
    } else {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredNotes(filtered)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadNotes()
    }, []),
  )

  if (loading) {
    return (
      <View
        style={[
          commonStyles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8fafc",
          },
        ]}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 40,
            borderRadius: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 12,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: colors.primary + "15",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <Text
            style={[
              typography.body,
              {
                fontSize: 18,
                fontWeight: "600",
                color: "#1a202c",
                marginBottom: 8,
                textAlign: "center",
              },
            ]}
          >
            Loading your notes
          </Text>
          <Text
            style={[
              typography.body,
              {
                fontSize: 14,
                color: colors.text,
                opacity: 0.6,
                textAlign: "center",
              },
            ]}
          >
            Please wait a moment...
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: "#f8fafc" }]}>
      <View
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingVertical: 28,
          marginHorizontal: -20,
          marginTop: -20,
          marginBottom: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                typography.h1,
                {
                  fontSize: 32,
                  fontWeight: "800",
                  color: "#1a202c",
                  letterSpacing: -0.5,
                  marginBottom: 4,
                },
              ]}
            >
              My Notes
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                  marginRight: 8,
                }}
              />
              <Text
                style={[
                  typography.body,
                  {
                    color: colors.text,
                    opacity: 0.7,
                    fontSize: 15,
                    fontWeight: "500",
                  },
                ]}
              >
                {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              commonStyles.button,
              {
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 24,
                paddingVertical: 14,
                borderRadius: 20,
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              },
            ]}
            onPress={() => router.push("/add")}
            activeOpacity={0.8}
          >
            <FontAwesome name="plus" size={16} color="white" style={{ marginRight: 8 }} />
            <Text style={[commonStyles.buttonText, { fontWeight: "700", fontSize: 15 }]}>Add Note</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          commonStyles.searchContainer,
          {
            marginBottom: 24,
            backgroundColor: "white",
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
            paddingHorizontal: 6,
            paddingVertical: 6,
          },
        ]}
      >
        <View
          style={[
            commonStyles.searchInnerContainer,
            {
              backgroundColor: "#f8fafc",
              borderRadius: 16,
              paddingHorizontal: 18,
              paddingVertical: 14,
            },
          ]}
        >
          <FontAwesome name="search" size={18} color="#64748b" style={{ marginRight: 14 }} />
          <TextInput
            style={[
              commonStyles.searchInput,
              {
                fontSize: 16,
                color: "#1a202c",
                flex: 1,
                fontWeight: "500",
              },
            ]}
            placeholder="Search your notes..."
            placeholderTextColor="#94a3b8"
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
        <View
          style={{
            backgroundColor: "#fef2f2",
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: colors.error,
            shadowColor: colors.error,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="exclamation-triangle" size={16} color={colors.error} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.error, fontWeight: "500", flex: 1 }}>{error}</Text>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                marginTop: 80,
                backgroundColor: "white",
                marginHorizontal: 20,
                padding: 48,
                borderRadius: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
                elevation: 6,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.primary + "15",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <FontAwesome name="sticky-note-o" size={36} color={colors.primary} />
              </View>
              <Text
                style={{
                  color: "#1a202c",
                  fontSize: 22,
                  fontWeight: "700",
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                No notes yet
              </Text>
              <Text
                style={{
                  color: colors.text,
                  opacity: 0.6,
                  fontSize: 16,
                  textAlign: "center",
                  lineHeight: 24,
                  marginBottom: 32,
                }}
              >
                Start capturing your thoughts and ideas{"\n"}by creating your first note
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  borderRadius: 16,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => router.push("/add")}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  Create First Note
                </Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item, index }) => (
            <View>
              <View
                style={[
                  commonStyles.card,
                  {
                    backgroundColor: "white",
                    borderLeftWidth: 6,
                    borderLeftColor: item.color || colors.primary,
                    marginBottom: 20,
                    marginHorizontal: 6,
                    padding: 24,
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                    elevation: 8,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/[id]/view", params: { id: item._id } })}
                  style={{ flex: 1 }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      typography.h2,
                      {
                        marginBottom: 14,
                        fontSize: 22,
                        fontWeight: "800",
                        color: "#1a202c",
                        lineHeight: 28,
                        letterSpacing: -0.3,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      typography.body,
                      {
                        color: "#4a5568",
                        opacity: 0.85,
                        marginBottom: 20,
                        lineHeight: 24,
                        fontSize: 16,
                        fontWeight: "400",
                      },
                    ]}
                    numberOfLines={3}
                  >
                    {item.content}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 16,
                      borderTopWidth: 1,
                      borderTopColor: "#f1f5f9",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: colors.primary + "15",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: colors.primary + "20",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: colors.primary,
                          fontWeight: "700",
                        }}
                      >
                        Tap to read more
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                    gap: 16,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/edit/${item._id}`)}
                    style={[
                      commonStyles.button,
                      {
                        flex: 1,
                        backgroundColor: colors.primary + "15",
                        paddingVertical: 14,
                        borderRadius: 16,
                        borderWidth: 1.5,
                        borderColor: colors.primary + "30",
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <FontAwesome name="edit" size={15} color={colors.primary} style={{ marginRight: 8 }} />
                      <Text
                        style={[
                          commonStyles.buttonText,
                          {
                            color: colors.primary,
                            fontWeight: "700",
                            fontSize: 15,
                          },
                        ]}
                      >
                        Edit
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => showDeleteConfirmation(item._id)}
                    style={[
                      commonStyles.button,
                      {
                        flex: 1,
                        backgroundColor: colors.error + "15",
                        paddingVertical: 14,
                        borderRadius: 16,
                        borderWidth: 1.5,
                        borderColor: colors.error + "30",
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <FontAwesome name="trash" size={15} color={colors.error} style={{ marginRight: 8 }} />
                      <Text
                        style={[
                          commonStyles.buttonText,
                          {
                            color: colors.error,
                            fontWeight: "700",
                            fontSize: 15,
                          },
                        ]}
                      >
                        Delete
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  )
}
