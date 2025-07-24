import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useRef, useEffect, useState } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

export default function ReciboVendaScreen() {
  const { params } = useRoute<any>();
  const navigation = useNavigation();
  const reciboRef = useRef<ViewShot>(null);
  const [nomeFantasia, setNomeFantasia] = useState('');

  const {
    cliente,
    produtos,
    formaPagamento,
    desconto,
    entrada,
    vezes,
    total,
    criadoEm,
  } = params;

  useEffect(() => {
    const fetchEmpresa = async () => {
      const snap = await getDoc(doc(db, 'configuracoes', 'empresa'));
      if (snap.exists()) {
        setNomeFantasia(snap.data().nomeFantasia);
      }
    };
    fetchEmpresa();
  }, []);

  const compartilharImagem = async () => {
    try {
      setTimeout(async () => {
        const uri = await reciboRef.current?.capture();
        await Sharing.shareAsync(uri);
      }, 500);
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ViewShot ref={reciboRef} style={styles.reciboBox} options={{ format: 'png', quality: 1 }}>
        <Text style={styles.header}>{nomeFantasia}</Text>
        <Text style={styles.subHeader}>Recibo de Venda</Text>

        <Text style={styles.label}>
          Cliente: <Text style={styles.value}>{cliente.nome}</Text>
        </Text>
        <Text style={styles.label}>
          Data: <Text style={styles.value}>
            {new Date(criadoEm.seconds * 1000).toLocaleDateString('pt-BR')}
          </Text>
        </Text>

        <Text style={styles.label}>Itens:</Text>
        {produtos.map((item: any, index: number) => (
          <Text key={index} style={styles.item}>
            - {item.nome} ({item.tamanho} - {item.cor}) {item.quantidade} x R$ {item.preco.toFixed(2).replace('.', ',')}
          </Text>
        ))}

        <Text style={styles.label}>
          Forma de pagamento: <Text style={styles.value}>{formaPagamento}</Text>
        </Text>
        {entrada ? (
          <Text style={styles.label}>
            Entrada: <Text style={styles.value}>R$ {entrada.toFixed(2).replace('.', ',')}</Text>
          </Text>
        ) : null}
        {vezes ? (
          <Text style={styles.label}>
            Parcelado em: <Text style={styles.value}>{vezes}x</Text>
          </Text>
        ) : null}
        <Text style={styles.label}>
          Desconto: <Text style={styles.value}>R$ {desconto.toFixed(2).replace('.', ',')}</Text>
        </Text>
        <Text style={styles.label}>
          Total: <Text style={styles.total}>R$ {total.toFixed(2).replace('.', ',')}</Text>
        </Text>

        <Text style={styles.footer}>Obrigado pela preferência!</Text>
      </ViewShot>

      <TouchableOpacity style={styles.button} onPress={compartilharImagem}>
        <Text style={styles.buttonText}>Compartilhar Recibo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#6366f1', marginTop: 12 }]}
        onPress={() => navigation.navigate('Home', { screen: 'Vendas' })}
      >
        <Text style={styles.buttonText}>Voltar para Home</Text>
      </TouchableOpacity>
    </View>
  );
}