import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
    gap: 12,
  },
  title: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 10,
  },
  conteudoWrapper: {
    maxHeight: '60%',
  },
  box: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardDetail: {
    fontSize: 14,
    color: '#374151',
  },
  cardTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 4,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginTop: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 6,
  },
  promissoriaGroup: {
    gap: 10,
    marginTop: 6,
  },
  totalBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    marginTop: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 4,
  },
  finalButton: {
    backgroundColor: '#f63b92ff',
    padding: 14,
    borderRadius: 8,
  },
  finalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
});