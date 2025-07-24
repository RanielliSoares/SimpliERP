import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
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
  listaWrapper: {
  flex: 1,
  maxHeight: '55%', // 👈 ajusta conforme necessário
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 45,
    left: 20,
    right: 20,
    gap: 10,
  },
  addButton: {
    backgroundColor: '#f63b92ff',
    padding: 12,
    borderRadius: 8,
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
  cancelButton: {
    backgroundColor: '#9ca3af',
    padding: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalCancel: {
    marginTop: 16,
    alignSelf: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#f63b92ff',
    fontWeight: 'bold',
  },
});