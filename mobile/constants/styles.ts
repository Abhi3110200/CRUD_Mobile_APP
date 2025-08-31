import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export const colors = {
  primary: '#4a90e2',
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  border: '#e0e0e0',
  error: '#e74c3c',
  success: '#2ecc71',
};

export const noteColors = [
  '#ffffff', // white
  '#f8e5e5', // light red
  '#f8f5e5', // light yellow
  '#e8f8e5', // light green
  '#e5f8f5', // light teal
  '#e5e8f8', // light blue
  '#f0e5f8', // light purple
  '#f8e5f0', // light pink
];

export const typography: {
  h1: TextStyle;
  h2: TextStyle;
  body: TextStyle;
} = {
  h1: {
    fontSize: 24,
    fontWeight: 'bold' as FontWeight,
    color: colors.text,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as FontWeight,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
};

interface Styles {
  container: ViewStyle;
  card: ViewStyle;
  input: TextStyle;
  inputContainer: ViewStyle;
  searchContainer: ViewStyle;
  searchInnerContainer: ViewStyle;
  searchInput: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  errorText: TextStyle;
  colorPicker: ViewStyle;
  colorOption: ViewStyle;
  colorOptionSelected: ViewStyle;
}

export const commonStyles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  searchInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
    paddingHorizontal: 8,
    margin: 0,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600' as FontWeight,
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
    gap: 8,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.primary,
  },
});
