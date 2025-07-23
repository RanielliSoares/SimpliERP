import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

type Produto = {
  id: string;
  nome: string;
  preco: number;
  quantidade?: number;
};

type Cliente = {
  id: string;
  nome: string;
  telefone?: string;
};

export default function NovaVendaScreen() {
  const navigation = useNavigation();

  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalClienteVisivel, setModalClienteVisivel] = useState(false);

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([]);
  const [modalProdutoVisivel, setModalProdutoVisivel] = useState(false);

  const abrirSelecaoCliente = async () => {
    try {
      const snap = await getDocs(collection(db, 'clientes'));
      const lista = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Cliente[];
      setClientes(lista);
      setModalClienteVisivel(true);
    } catch (error) {
      console.log('Erro ao buscar clientes:', error);
    }
  };

  const abrirSelecaoProduto = async () => {
    try {
      const snap = await getDocs(collection(db, 'produtos'));
      const lista = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        quantidade: 1,
      })) as Produto[];
      setProdutosDisponiveis(lista);
      setModalProdutoVisivel(true);
    } catch (error) {
      console.log('Erro ao buscar produtos:', error);
    }
  };

  const selecionarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setModalClienteVisivel(false);
  };

  const adicionarProduto = (produto: Produto) => {
    const jaAdicionado = produtos.find(p => p.id === produto.id);
    if (!jaAdicionado) {
      setProdutos([...produtos, produto]);
    }
    setModalProdutoVisivel(false);
  };

  const irParaResumo = () => {
    navigation.navigate('ResumoVenda', {
      cliente: clienteSelecionado,
      produtos,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nova Venda</Text>

      <TouchableOpacity style={styles.box} onPress={abrirSelecaoCliente}>
        <Text style={styles.boxLabel}>Cliente</Text>
        <Text style={styles.boxValue}>
          {clienteSelecionado ? clienteSelecionado.nome : 'Selecionar cliente'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text style={styles.cardDetail}>Qtd: {item.quantidade ?? 1}</Text>
            <Text style={styles.cardDetail}>
              Total: R$ {(item.quantidade! * item.preco).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum produto adicionado</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={abrirSelecaoProduto}>
        <Text style={styles.addButtonText}>Adicionar produto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.nextButton,
          (!clienteSelecionado || produtos.length === 0) && { opacity: 0.5 },
        ]}
        disabled={!clienteSelecionado || produtos.length === 0}
        onPress={irParaResumo}
      >
        <Text style={styles.nextButtonText}>Próxima tela</Text>
      </TouchableOpacity>

      {/* Modal Cliente */}
      <Modal isVisible={modalClienteVisivel}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Selecionar Cliente</Text>
          {clientes.map((cli) => (
            <TouchableOpacity
              key={cli.id}
              style={styles.modalItem}
              onPress={() => selecionarCliente(cli)}
            >
              <Text>{cli.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* Modal Produto */}
      <Modal isVisible={modalProdutoVisivel}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Selecionar Produto</Text>
          {produtosDisponiveis.map((prod) => (
            <TouchableOpacity
              key={prod.id}
              style={styles.modalItem}
              onPress={() => adicionarProduto(prod)}
            >
              <Text>{prod.nome} - R$ {prod.preco.toFixed(2).replace('.', ',')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </SafeAreaView>
  );
}