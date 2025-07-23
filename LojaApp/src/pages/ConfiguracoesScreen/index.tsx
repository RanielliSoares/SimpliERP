import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ConfiguracoesScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('Empresa')}
      >
        <MaterialCommunityIcons name="office-building" size={24} color="#374151" />
        <Text style={styles.optionText}>Empresa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('FormasPagamento')}
      >
        <MaterialCommunityIcons name="credit-card-outline" size={24} color="#374151" />
        <Text style={styles.optionText}>Formas de pagamento</Text>
      </TouchableOpacity>

      {/* Adicione mais opções aqui futuramente */}
    </SafeAreaView>
  );
}