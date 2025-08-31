import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTES_KEY = "NOTES";

export const getNotes = async () => {
  const json = await AsyncStorage.getItem(NOTES_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveNotes = async (notes: any[]) => {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};
