import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback } from 'react';

type Cliente = {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  permitePromissoria?: boolean;
  limiteCredito?: number;
};

export default function ClientesScreen() {
  const navigation = useNavigation();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState('');

  const buscarClientes = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'clientes'));
      const lista: Cliente[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Cliente[];

      const listaOrdenada = lista.sort((a, b) =>
        a.nome.localeCompare(b.nome),
      );

      setClientes(listaOrdenada);
      setClientesFiltrados(listaOrdenada);
    } catch (error) {
      console.log('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarClientes();
    }, []),
  );

  const filtrarClientes = () => {
    const termo = pesquisa.toLowerCase();
    const filtrados = clientes.filter((item) =>
      item.nome.toLowerCase().includes(termo),
    );
    setClientesFiltrados(filtrados);
  };

  const renderItem = ({ item }: { item: Cliente }) => {
    const corPromissoria = item.permitePromissoria ? '#059669' : '#b91c1c';
    const textoPromissoria = item.permitePromissoria ? 'Sim' : 'Não';
    const limite = item.permitePromissoria ? item.limiteCredito ?? 0 : 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CadastroCliente', { cliente: item })}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#555" />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDetail}>Telefone: {item.telefone }</Text>
        <Text style={[styles.cardDetail, { color: corPromissoria }]}>
          Promissória: {textoPromissoria}
        </Text>
        <Text style={styles.cardDetail}>
          Limite: R$ {limite.toFixed(2).replace('.', ',')}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cliente..."
          value={pesquisa}
          onChangeText={setPesquisa}
        />
        <TouchableOpacity style={styles.searchButton} onPress={filtrarClientes}>
          <MaterialCommunityIcons name="magnify" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f63b92ff" />
      ) : clientesFiltrados.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('CadastroCliente')}
        style={styles.fixedButton}
      >
        <Text style={styles.buttonText}>Adicionar novo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}