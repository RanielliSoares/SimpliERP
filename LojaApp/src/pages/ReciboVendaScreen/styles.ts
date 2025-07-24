import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  reciboBox: {
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#222',
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginTop: 6,
  },
  value: {
    fontWeight: 'bold',
  },
  item: {
    fontSize: 14,
    marginVertical: 2,
    color: '#444',
  },
  total: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
  },
  footer: {
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    color: '#777',
  },
  button: {
    backgroundColor: '#00b894',
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});