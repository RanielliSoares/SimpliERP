import { useState, useEffect } from 'react';
import {
  View, Text, Switch, TouchableOpacity
} from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import Toast from 'react-native-toast-message';

export default function FormasPagamentoScreen() {
  const [dinheiro, setDinheiro] = useState(true);
  const [pix, setPix] = useState(true);
  const [cartaoCredito, setCartaoCredito] = useState(false);
  const [cartaoDebito, setCartaoDebito] = useState(false);
  const [promissoria, setPromissoria] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const snap = await getDoc(doc(db, 'configuracoes', 'formasPagamento'));
        if (snap.exists()) {
          const dados = snap.data();
          setDinheiro(dados.dinheiro ?? false);
          setPix(dados.pix ?? false);
          setCartaoCredito(dados.cartaoCredito ?? false);
          setCartaoDebito(dados.cartaoDebito ?? false);
          setPromissoria(dados.promissoria ?? false);
        }
      } catch (error) {
        console.log('Erro ao carregar formas de pagamento:', error);
      }
    };
    carregarDados();
  }, []);

  const salvarFormas = async () => {
    try {
      await setDoc(doc(db, 'configuracoes', 'formasPagamento'), {
        dinheiro,
        pix,
        cartaoCredito,
        cartaoDebito,
        promissoria,
      }, { merge: true });

      Toast.show({ type: 'success', text1: 'Formas de pagamento salvas!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro ao salvar', text2: String(error) });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Formas de Pagamento</Text>

      {[
        { label: 'Dinheiro', value: dinheiro, setter: setDinheiro },
        { label: 'PIX', value: pix, setter: setPix },
        { label: 'Cartão Crédito', value: cartaoCredito, setter: setCartaoCredito },
        { label: 'Cartão Débito', value: cartaoDebito, setter: setCartaoDebito },
        { label: 'Promissória', value: promissoria, setter: setPromissoria },
      ].map((item) => (
        <View style={styles.item} key={item.label}>
          <Text style={styles.label}>{item.label}</Text>
          <Switch
            value={item.value}
            onValueChange={item.setter}
            trackColor={{ false: '#ccc', true: '#f63b92ff' }}
            thumbColor="#fff"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={salvarFormas}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}