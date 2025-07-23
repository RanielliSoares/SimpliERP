import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  boxLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  boxValue: {
    fontSize: 16,
    color: '#111827',
  },
  list: {
    flexGrow: 0,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    color: '#374151',
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#f63b92ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#059669',
    padding: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});