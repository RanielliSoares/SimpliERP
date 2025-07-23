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

type Produto = {
  id: string;
  produto: string;
  referencia?: string;
  cor?: string;
  tamanho?: string;
  fornecedor?: string;
  estoque: number;
  precoVenda: number;
  precoCusto?: number;
  margem?: string;
  descricao?: string;
};

export default function ProdutosScreen() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState('');

  const buscarProdutos = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'produtos'));
      const lista: Produto[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Produto[];

      const listaOrdenada = lista.sort((a, b) =>
        a.produto.localeCompare(b.produto),
      );

      setProdutos(listaOrdenada);
      setProdutosFiltrados(listaOrdenada);
    } catch (error) {
      console.log('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarProdutos();
    }, []),
  );

  const filtrarProdutos = () => {
    const termo = pesquisa.toLowerCase();
    const filtrados = produtos.filter((item) =>
      item.produto.toLowerCase().includes(termo),
    );
    setProdutosFiltrados(filtrados);
  };

  const renderItem = ({ item }: { item: Produto }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.produto}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CadastroProduto', { produto: item })}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#555" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardDetail}>Tamanho: {item.tamanho }</Text>
      <Text style={styles.cardDetail}>Cor: {item.cor }</Text>
      <Text style={styles.cardDetail}>Referência: {item.referencia }</Text>
      <Text style={styles.cardDetail}>Estoque: {item.estoque}</Text>
      <Text style={styles.cardDetail}>
        Preço: R$ {item.precoVenda?.toFixed(2).replace('.', ',')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          value={pesquisa}
          onChangeText={setPesquisa}
        />
        <TouchableOpacity style={styles.searchButton} onPress={filtrarProdutos}>
          <MaterialCommunityIcons name="magnify" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f63b92ff" />
      ) : produtosFiltrados.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('CadastroProduto')}
        style={styles.fixedButton}
      >
        <Text style={styles.buttonText}>Adicionar novo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}