import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  iconContainer: {
  alignItems: 'center',
  marginBottom: 10,
},

  button: {
    backgroundColor: '#f63b92ff',
    padding: 14,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkboxContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},
checkboxLabel: {
  marginLeft: 8,
  color: '#111827',
},
errorText: {
  marginTop: 12,
  color: '#ef4444',
  textAlign: 'center',
  fontSize: 14,
  fontWeight: '600',
},
});