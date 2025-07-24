import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Produto = {
  id: string;
  nome: string;
  preco: number;
  tamanho: string;
  cor: string;
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
  const [buscaProduto, setBuscaProduto] = useState('');

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
        nome: doc.data().produto,
        preco: doc.data().precoVenda ?? 0,
        tamanho: doc.data().tamanho,
        cor: doc.data().cor,
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
    setBuscaProduto('');
  };

  const alterarQuantidade = (id: string, operacao: 'mais' | 'menos') => {
    setProdutos(prev =>
      prev.map(p =>
        p.id === id
          ? {
            ...p,
            quantidade:
              operacao === 'mais'
                ? (p.quantidade ?? 1) + 1
                : Math.max((p.quantidade ?? 1) - 1, 1),
          }
          : p,
      ),
    );
  };

  const removerProduto = (id: string) => {
    setProdutos(prev => prev.filter(p => p.id !== id));
  };

  const irParaResumo = () => {
    navigation.navigate('ResumoVenda', {
      cliente: clienteSelecionado,
      produtos,
    });
  };

  const cancelarVenda = () => {
    setProdutos([]);
    setClienteSelecionado(null);
    navigation.goBack();
  };

  const produtosFiltrados = produtosDisponiveis.filter((p) => {
    const texto = buscaProduto.toLowerCase();
    return (
      p.nome?.toLowerCase().includes(texto) ||
      p.tamanho?.toLowerCase().includes(texto) ||
      p.cor?.toLowerCase().includes(texto)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nova Venda</Text>

      <TouchableOpacity style={styles.box} onPress={abrirSelecaoCliente}>
        <Text style={styles.boxLabel}>Cliente</Text>
        <Text style={styles.boxValue}>
          {clienteSelecionado ? clienteSelecionado.nome : 'Selecionar cliente'}
        </Text>
      </TouchableOpacity>

      <View style={styles.listaWrapper}>
        <ScrollView contentContainerStyle={{ gap: 10 }}>
          {produtos.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.nome} - {item.tamanho} - {item.cor}
              </Text>
              <View style={styles.cardRow}>
                <TouchableOpacity onPress={() => alterarQuantidade(item.id, 'menos')}>
                  <MaterialCommunityIcons name="minus-circle-outline" size={24} color="#555" />
                </TouchableOpacity>
                <Text style={styles.cardDetail}>{item.quantidade} un.</Text>
                <TouchableOpacity onPress={() => alterarQuantidade(item.id, 'mais')}>
                  <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#555" />
                </TouchableOpacity>
                <Text style={[styles.cardDetail, { marginLeft: 12 }]}>
                  Total: R$ {(item.quantidade! * item.preco).toFixed(2).replace('.', ',')}
                </Text>
                <TouchableOpacity onPress={() => removerProduto(item.id)} style={{ marginLeft: 'auto' }}>
                  <MaterialCommunityIcons name="trash-can-outline" size={24} color="#b91c1c" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {produtos.length === 0 && (
            <Text style={styles.empty}>Nenhum produto adicionado</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.footer}>
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

        <TouchableOpacity style={styles.cancelButton} onPress={cancelarVenda}>
          <Text style={styles.cancelButtonText}>Cancelar venda</Text>
        </TouchableOpacity>
      </View>

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
          <TouchableOpacity onPress={() => setModalClienteVisivel(false)} style={styles.modalCancel}>
            <Text style={styles.modalCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={modalProdutoVisivel}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Selecionar Produto</Text>

          <TextInput
            placeholder="Buscar por nome, tamanho ou cor..."
            value={buscaProduto}
            onChangeText={setBuscaProduto}
            style={styles.modalInput}
          />

          <ScrollView contentContainerStyle={{ gap: 10 }}>
            {produtosFiltrados.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.modalItem}
                onPress={() => adicionarProduto(item)}
              >
                <Text>{item.nome} - {item.tamanho} - {item.cor}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={() => setModalProdutoVisivel(false)} style={styles.modalCancel}>
            <Text style={styles.modalCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}