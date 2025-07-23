import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../services/firebaseConfig';
import {
    collection,
    addDoc,
    Timestamp,
    updateDoc,
    doc,
} from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { useRoute, RouteProp } from '@react-navigation/native';
type ParamsRoute = {
    CadastroProduto: {
        produto?: {
            id?: string;
            produto: string;
            referencia?: string;
            tamanho?: string;
            cor?: string;
            fornecedor?: string;
            estoque: number;
            precoVenda: number;
            precoCusto?: number;
            margem?: string;
            descricao?: string;
        };
    };
};

export default function CadastroProdutoScreen() {
    const route = useRoute<RouteProp<ParamsRoute, 'CadastroProduto'>>();
    const produtoEditado = route.params?.produto;


    const [produto, setProduto] = useState('');
    const [referencia, setReferencia] = useState('');
    const [tamanho, setTamanho] = useState('');
    const [cor, setCor] = useState('');
    const [fornecedor, setFornecedor] = useState('');
    const [estoque, setEstoque] = useState('');
    const [precoCusto, setPrecoCusto] = useState('');
    const [precoVenda, setPrecoVenda] = useState('');
    const [descricao, setDescricao] = useState('');

    useEffect(() => {
        if (produtoEditado) {
            setProduto(produtoEditado.produto || '');
            setReferencia(produtoEditado.referencia || '');
            setTamanho(produtoEditado.tamanho || '');
            setCor(produtoEditado.cor || '');
            setFornecedor(produtoEditado.fornecedor || '');
            setEstoque(String(produtoEditado.estoque || ''));
            setPrecoCusto(
                produtoEditado.precoCusto !== undefined
                    ? `R$ ${produtoEditado.precoCusto.toFixed(2).replace('.', ',')}`
                    : ''
            );

            setPrecoVenda(
                produtoEditado.precoVenda !== undefined
                    ? `R$ ${produtoEditado.precoVenda.toFixed(2).replace('.', ',')}`
                    : ''
            );
            setDescricao(produtoEditado.descricao || '');
        }
    }, []);

    const formatarMoeda = (valor: string) => {
        const limpo = valor.replace(/\D/g, '');
        const float = (parseFloat(limpo) / 100).toFixed(2);
        return `R$ ${float.replace('.', ',')}`;
    };
const navigation = useNavigation();
    const calcularMargem = () => {
        const custo = parseFloat(precoCusto.replace(/\D/g, '')) / 100;
        const venda = parseFloat(precoVenda.replace(/\D/g, '')) / 100;
        if (isNaN(custo) || isNaN(venda) || custo === 0) return '';
        const margem = ((venda - custo) / custo) * 100;
        return `${Math.round(margem)}%`;
    };

    const margem = calcularMargem();

    const salvarProduto = async () => {
        if (!produto || !precoCusto || !precoVenda || !estoque) {
            Toast.show({
                type: 'error',
                text1: 'Preencha os campos obrigatórios.',
            });
            return;
        }

        const dados = {
            produto,
            referencia,
            tamanho,
            cor,
            fornecedor,
            estoque: parseInt(estoque),
            precoCusto: parseFloat(precoCusto.replace(/\D/g, '')) / 100,
            precoVenda: parseFloat(precoVenda.replace(/\D/g, '')) / 100,
            margem,
            descricao,
            atualizadoEm: Timestamp.now(),
        };

        try {
            if (produtoEditado?.id) {
                await updateDoc(doc(db, 'produtos', produtoEditado.id), dados);
                Toast.show({ type: 'success', text1: 'Produto atualizado com sucesso!' });
                navigation.goBack();
            } else {
                await addDoc(collection(db, 'produtos'), {
                    ...dados,
                    criadoEm: Timestamp.now(),
                });
                Toast.show({ type: 'success', text1: 'Produto salvo com sucesso!' });
            }

            setProduto('');
            setReferencia('');
            setTamanho('');
            setCor('');
            setFornecedor('');
            setEstoque('');
            setPrecoCusto('');
            setPrecoVenda('');
            setDescricao('');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar o produto',
                text2: String(error),
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>
                    {produtoEditado ? 'Editar Produto' : 'Cadastro de Produtos'}
                </Text>

                <View style={styles.field}><Text style={styles.label}>Produto</Text><TextInput style={styles.input} value={produto} onChangeText={setProduto} /></View>
                <View style={styles.field}><Text style={styles.label}>Referência</Text><TextInput style={styles.input} value={referencia} onChangeText={setReferencia} /></View>
                <View style={styles.field}><Text style={styles.label}>Tamanho</Text><TextInput style={styles.input} value={tamanho} onChangeText={setTamanho} /></View>
                <View style={styles.field}><Text style={styles.label}>Cor</Text><TextInput style={styles.input} value={cor} onChangeText={setCor} /></View>
                <View style={styles.field}><Text style={styles.label}>Fornecedor</Text><TextInput style={styles.input} value={fornecedor} onChangeText={setFornecedor} /></View>
                <View style={styles.field}><Text style={styles.label}>Estoque</Text><TextInput style={styles.input} value={estoque} onChangeText={setEstoque} keyboardType="numeric" /></View>
                <View style={styles.field}><Text style={styles.label}>Preço Custo</Text><TextInput style={styles.input} value={precoCusto} onChangeText={(text) => setPrecoCusto(formatarMoeda(text))} keyboardType="numeric" /></View>
                <View style={styles.field}><Text style={styles.label}>Preço Venda</Text><TextInput style={styles.input} value={precoVenda} onChangeText={(text) => setPrecoVenda(formatarMoeda(text))} keyboardType="numeric" /></View>
                <View style={styles.field}><Text style={styles.label}>Margem</Text><Text style={styles.margemValue}>{margem || '-'}</Text></View>
                <View style={styles.field}><Text style={styles.label}>Descrição</Text><TextInput style={[styles.input, styles.textarea]} value={descricao} onChangeText={setDescricao} multiline numberOfLines={4} /></View>

                <TouchableOpacity style={styles.button} onPress={salvarProduto}>
                    <Text style={styles.buttonText}>
                        {produtoEditado ? 'Atualizar Produto' : 'Salvar Produto'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}