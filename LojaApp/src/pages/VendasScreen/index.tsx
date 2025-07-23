import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function VendasScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* 👇 Aqui futuramente vai o dashboard */}
      <View style={styles.content}>
        <Text style={styles.title}>Vendas</Text>
        <Text style={styles.subtitle}>Resumo do dia, total vendido, etc...</Text>
      </View>

      <TouchableOpacity
        style={styles.fixedButton}
        onPress={() => navigation.navigate('NovaVenda')}
      >
        <Text style={styles.buttonText}>Nova venda</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}