import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

export default function VendasScreen() {
  const navigation = useNavigation();
  const [dias, setDias] = useState<string[]>([]);
  const [valores, setValores] = useState<number[]>([]);
  const [maisVendidos, setMaisVendidos] = useState<{ nome: string; quantidade: number }[]>([]);

  useEffect(() => {
    const buscarVendas = async () => {
      const snap = await getDocs(collection(db, 'vendas'));
      const hoje = new Date();
      const diasRecentes = [...Array(7)].map((_, i) => {
        const dia = new Date(hoje);
        dia.setDate(dia.getDate() - i);
        return dia;
      }).reverse();

      const vendasPorDia = diasRecentes.map((dia) => {
        const filtro = snap.docs.filter((doc) => {
          const criado = doc.data().criadoEm as Timestamp;
          const dataVenda = criado.toDate();
          return dataVenda.toDateString() === dia.toDateString();
        });

        const totalDoDia = filtro.reduce((soma, doc) => soma + (doc.data().total ?? 0), 0);
        return totalDoDia;
      });

      setDias(diasRecentes.map(d => d.toLocaleDateString('pt-BR').slice(0, 5)));
      setValores(vendasPorDia);

      const contagem: Record<string, { nome: string; quantidade: number }> = {};
      snap.docs.forEach((doc) => {
        const lista = doc.data().produtos || [];
        lista.forEach((p: any) => {
          const id = p.id;
          if (!contagem[id]) {
            contagem[id] = { nome: p.nome, quantidade: 0 };
          }
          contagem[id].quantidade += p.quantidade;
        });
      });

      const top = Object.values(contagem)
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5);

      setMaisVendidos(top);
    };

    buscarVendas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Vendas</Text>
          <Text style={styles.subtitle}>Últimos 7 dias</Text>

          <BarChart
            data={{
              labels: dias,
              datasets: [{ data: valores }],
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            fromZero
            showValuesOnTopOfBars
            yAxisLabel="R$ "
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#f7f7f7',
              backgroundGradientTo: '#fff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(246, 59, 146, ${opacity})`,
              labelColor: () => '#555',
              style: { borderRadius: 8 },
            }}
            style={{ marginVertical: 8, borderRadius: 8 }}
          />

          <Text style={styles.subtitle}>Produtos mais vendidos</Text>

          {maisVendidos.length > 0 ? (
            <BarChart
              data={{
                labels: maisVendidos.map((p) => p.nome),
                datasets: [{ data: maisVendidos.map((p) => p.quantidade) }],
              }}
              width={Dimensions.get('window').width - 40}
              height={220}
              fromZero
              showValuesOnTopOfBars
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#f7f7f7',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 170, 203, ${opacity})`,
                labelColor: () => '#555',
                style: { borderRadius: 8 },
              }}
              style={{ marginVertical: 8, borderRadius: 8 }}
              verticalLabelRotation={10}
            />
          ) : (
            <Text style={styles.item}>Nenhum produto vendido ainda.</Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fixedButton}
        onPress={() => navigation.navigate('NovaVenda')}
      >
        <Text style={styles.buttonText}>Nova venda</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}