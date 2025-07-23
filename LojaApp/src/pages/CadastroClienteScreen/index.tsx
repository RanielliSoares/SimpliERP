import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Switch,
    KeyboardAvoidingView,
    Platform,
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type ClienteParams = {
    CadastroCliente: {
        cliente?: {
            id?: string;
            nome: string;
            telefone?: string;
            email?: string;
            endereco?: string;
            permitePromissoria?: boolean;
            limiteCredito?: number;
        };
    };
};

export default function CadastroClienteScreen() {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ClienteParams, 'CadastroCliente'>>();
    const clienteEditado = route.params?.cliente;

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');
    const [permitePromissoria, setPermitePromissoria] = useState(false);
    const [limiteCredito, setLimiteCredito] = useState('R$ 100,00');

    useEffect(() => {
        if (clienteEditado) {
            setNome(clienteEditado.nome || '');
            setTelefone(clienteEditado.telefone || '');
            setEmail(clienteEditado.email || '');
            setEndereco(clienteEditado.endereco || '');
            setPermitePromissoria(clienteEditado.permitePromissoria || false);
            const valor = clienteEditado.limiteCredito ?? 0;
            setLimiteCredito(`R$ ${valor.toFixed(2).replace('.', ',')}`);
        }
    }, []);

    const formatarMoeda = (valor: string) => {
        const limpo = valor.replace(/\D/g, '');
        const float = (parseFloat(limpo) / 100).toFixed(2);
        return `R$ ${float.replace('.', ',')}`;
    };

    const salvarCliente = async () => {
        if (!nome) {
            Toast.show({ type: 'error', text1: 'O campo nome é obrigatório.' });
            return;
        }

        const dados = {
            nome,
            telefone,
            email,
            endereco,
            permitePromissoria,
            limiteCredito: permitePromissoria
                ? parseFloat(limiteCredito.replace(/\D/g, '')) / 100
                : 0,
            atualizadoEm: Timestamp.now(),
        };

        try {
            if (clienteEditado?.id) {
                await updateDoc(doc(db, 'clientes', clienteEditado.id), dados);
                Toast.show({ type: 'success', text1: 'Cliente atualizado com sucesso!' });
            } else {
                await addDoc(collection(db, 'clientes'), {
                    ...dados,
                    criadoEm: Timestamp.now(),
                });
                Toast.show({ type: 'success', text1: 'Cliente salvo com sucesso!' });
            }

            setNome('');
            setTelefone('');
            setEmail('');
            setEndereco('');
            setPermitePromissoria(false);
            setLimiteCredito('R$ 100,00');
            navigation.goBack();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar cliente',
                text2: String(error),
            });
        }
    };
    const formatarTelefone = (valor: string) => {
        const limpo = valor.replace(/\D/g, '');

        if (limpo.length <= 2) {
            return `(${limpo}`;
        } else if (limpo.length <= 7) {
            return `(${limpo.slice(0, 2)}) ${limpo.slice(2)}`;
        } else {
            return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7, 11)}`;
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>
                        {clienteEditado ? 'Editar Cliente' : 'Cadastro de Cliente'}
                    </Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput style={styles.input} value={nome} onChangeText={setNome} />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Telefone</Text>
                        <TextInput
                            style={styles.input}
                            value={telefone}
                            onChangeText={(text) => setTelefone(formatarTelefone(text))}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Endereço</Text>
                        <TextInput
                            style={[styles.input, styles.textarea]}
                            value={endereco}
                            onChangeText={setEndereco}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <View style={styles.checkboxContainer}>
                        <Text style={styles.label}>Permite promissória</Text>
                        <Switch
                            value={permitePromissoria}
                            onValueChange={(valor) => {
                                setPermitePromissoria(valor);
                                if (valor && !limiteCredito) {
                                    setLimiteCredito('R$ 100,00');
                                }
                            }}
                            trackColor={{ false: '#ccc', true: '#f63b92ff' }}
                            thumbColor={'#fff'}
                        />
                    </View>

                    {permitePromissoria && (
                        <View style={styles.field}>
                            <Text style={styles.label}>Limite de crédito</Text>
                            <TextInput
                                style={styles.input}
                                value={limiteCredito}
                                onChangeText={(text) => setLimiteCredito(formatarMoeda(text))}
                                keyboardType="numeric"
                            />
                        </View>
                    )}

                    <TouchableOpacity style={styles.button} onPress={salvarCliente}>
                        <Text style={styles.buttonText}>
                            {clienteEditado ? 'Atualizar Cliente' : 'Salvar Cliente'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}