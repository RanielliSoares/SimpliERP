import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140, // espaço reservado para não colidir com botão fixo
  },
  content: {
    minHeight: 600,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 12,
    marginTop: 12,
  },
  item: {
    fontSize: 15,
    color: '#444',
    marginVertical: 4,
  },
  fixedButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#f63b92',
    paddingVertical: 14,
    borderRadius: 6,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});