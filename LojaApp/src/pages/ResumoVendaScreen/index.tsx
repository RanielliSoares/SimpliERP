import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  addDoc,
  collection,
  Timestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import Toast from 'react-native-toast-message';

export default function ResumoVendaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { cliente, produtos } = route.params;

  const [descontoBruto, setDescontoBruto] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [vezes, setVezes] = useState('');
  const [entrada, setEntrada] = useState('');

  const formatarMoeda = (valor: string) => {
    const limpa = valor.replace(/[^\d]/g, '');
    const numero = parseFloat(limpa) / 100;
    if (isNaN(numero)) return 'R$ 0,00';
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const calcularTotal = () => {
    const valorDesconto = parseFloat(descontoBruto) / 100 || 0;
    const totalBruto = produtos.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0,
    );
    return Math.max(totalBruto - valorDesconto, 0);
  };

  const finalizarVenda = async () => {
    if (!formaPagamento) {
      Toast.show({
        type: 'error',
        text1: 'Selecione uma forma de pagamento.',
      });
      return;
    }

    if (
      formaPagamento === 'Cartão Crédito' &&
      (!vezes || parseInt(vezes) <= 0)
    ) {
      Toast.show({
        type: 'error',
        text1: 'Informe a quantidade de parcelas no crédito.',
      });
      return;
    }

    let valorRestante = 0;

    if (formaPagamento === 'Promissória') {
      const entradaValor =
        parseFloat(entrada.replace(/[^\d]/g, '')) / 100 || 0;
      valorRestante = calcularTotal() - entradaValor;

      if (entradaValor <= 0) {
        Toast.show({
          type: 'error',
          text1: 'É necessário informar o valor da entrada.',
        });
        return;
      }

      if (!cliente.limiteCredito || cliente.limiteCredito <= 0) {
        Toast.show({
          type: 'error',
          text1: 'Cliente sem limite de crédito definido.',
        });
        return;
      }

      if (valorRestante > cliente.creditoDisponivel) {
        Toast.show({
          type: 'error',
          text1: 'Limite de crédito excedido',
          text2: `Disponível: R$ ${cliente.creditoDisponivel
            .toFixed(2)
            .replace('.', ',')}\nValor restante: R$ ${valorRestante
              .toFixed(2)
              .replace('.', ',')}`,
        });
        return;
      }

      if (!vezes || parseInt(vezes) <= 0) {
        Toast.show({
          type: 'error',
          text1: 'Informe a quantidade de parcelas na promissória.',
        });
        return;
      }
    }

    try {
      await addDoc(collection(db, 'vendas'), {
        clienteId: cliente.id,
        clienteNome: cliente.nome,
        produtos,
        desconto: parseFloat(descontoBruto) / 100 || 0,
        formaPagamento,
        entrada:
          formaPagamento === 'Promissória'
            ? parseFloat(entrada.replace(/[^\d]/g, '')) / 100 || 0
            : null,
        vezes:
          formaPagamento === 'Cartão Crédito' ||
            formaPagamento === 'Promissória'
            ? parseInt(vezes)
            : null,
        total: calcularTotal(),
        criadoEm: Timestamp.now(),
      });

      if (formaPagamento === 'Promissória') {
        const novoCredito = cliente.creditoDisponivel - valorRestante;
        await updateDoc(doc(db, 'clientes', cliente.id), {
          creditoDisponivel: novoCredito,
        });
      }

      for (const item of produtos) {
        const novoEstoque = item.estoque - item.quantidade;

        if (novoEstoque < 0) {
          Toast.show({
            type: 'error',
            text1: 'Erro ao atualizar estoque',
            text2: `Estoque do produto "${item.nome}" não pode ser negativo.`,
          });
          return;
        }

        await updateDoc(doc(db, 'produtos', item.id), {
          estoque: novoEstoque,
        });
      }
      Toast.show({
        type: 'success',
        text1: 'Venda registrada com sucesso!',
      });

      setTimeout(() => {
        navigation.navigate('ReciboVenda', {
          cliente,
          produtos,
          formaPagamento,
          desconto: parseFloat(descontoBruto) / 100 || 0,
          entrada:
            formaPagamento === 'Promissória'
              ? parseFloat(entrada.replace(/[^\d]/g, '')) / 100 || 0
              : null,
          vezes:
            formaPagamento === 'Cartão Crédito' || formaPagamento === 'Promissória'
              ? parseInt(vezes)
              : null,
          total: calcularTotal(),
          criadoEm: Timestamp.now(),
        });
      }, 1500);

    } catch (error) {
      console.log('Erro ao registrar venda:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao registrar venda',
        text2: 'Tente novamente.',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Resumo da Venda</Text>

          <View style={styles.conteudoWrapper}>
            <ScrollView
              contentContainerStyle={{ gap: 12 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.box}>
                <Text style={styles.label}>Cliente:</Text>
                <Text style={styles.value}>{cliente.nome}</Text>
                {cliente.telefone && (
                  <Text style={styles.value}>
                    Telefone: {cliente.telefone}
                  </Text>
                )}
              </View>

              <Text style={styles.subTitle}>Itens</Text>
              {produtos.map((item, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardDetail}>
                    {item.tamanho} - {item.cor}
                  </Text>
                  <Text style={styles.cardDetail}>
                    {item.quantidade} un. x R${' '}
                    {item.preco.toFixed(2).replace('.', ',')}
                  </Text>
                  <Text style={styles.cardTotal}>
                    Subtotal: R${' '}
                    {(item.quantidade * item.preco)
                      .toFixed(2)
                      .replace('.', ',')}
                  </Text>
                </View>
              ))}

              <Text style={styles.subTitle}>Desconto</Text>
              <TextInput
                placeholder="R$ 0,00"
                keyboardType="numeric"
                value={formatarMoeda(descontoBruto)}
                onChangeText={(text) => {
                  const somenteNumeros = text.replace(/[^\d]/g, '');
                  setDescontoBruto(somenteNumeros);
                }}
                style={styles.input}
              />

              <Text style={styles.subTitle}>Forma de Pagamento</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formaPagamento}
                  onValueChange={(value) => {
                    setFormaPagamento(value);
                    setEntrada('');
                    setVezes('');
                  }}
                >
                  <Picker.Item label="Selecionar..." value="" />
                  <Picker.Item label="Pix" value="Pix" />
                  <Picker.Item label="Dinheiro" value="Dinheiro" />
                  <Picker.Item label="Cartão Débito" value="Cartão Débito" />
                  <Picker.Item label="Cartão Crédito" value="Cartão Crédito" />
                  <Picker.Item label="Promissória" value="Promissória" />
                </Picker>
              </View>

              {formaPagamento === 'Cartão Crédito' && (
                <TextInput
                  placeholder="Parcelado em quantas vezes?"
                  keyboardType="numeric"
                  value={vezes}
                  onChangeText={setVezes}
                  style={styles.input}
                />
              )}

              {formaPagamento === 'Promissória' && (
                <View style={styles.promissoriaGroup}>
                  <TextInput
                    placeholder="Valor da entrada"
                    keyboardType="numeric"
                    value={formatarMoeda(entrada)}
                    onChangeText={setEntrada}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Parcelado em quantas vezes?"
                    keyboardType="numeric"
                    value={vezes}
                    onChangeText={setVezes}
                    style={styles.input}
                  />
                </View>
              )}
            </ScrollView>
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total com desconto:</Text>
            <Text style={styles.totalValue}>
              R$ {calcularTotal().toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.finalButton} onPress={finalizarVenda}>
              <Text style={styles.finalButtonText}>Finalizar Venda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}