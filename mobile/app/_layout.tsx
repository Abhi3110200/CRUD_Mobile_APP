import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
    <StatusBar barStyle="dark-content"/>
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="index" options={{ title: "Notes" }} />
      <Stack.Screen name="add" options={{ title: "Add Note" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Note" }} />
    </Stack>
    </>
  );
}
