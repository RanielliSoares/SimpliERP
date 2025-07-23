import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

export default function ResumoVendaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Resumo da Venda</Text>
      <Text style={styles.info}>Tela em construção...</Text>
    </SafeAreaView>
  );
}