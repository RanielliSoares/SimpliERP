import { useEffect, useState } from 'react';
import {
    View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView,
    Platform
} from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import Toast from 'react-native-toast-message';

export default function EmpresaScreen() {
    const [razaoSocial, setRazaoSocial] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const snap = await getDoc(doc(db, 'configuracoes', 'empresa'));
                if (snap.exists()) {
                    const dados = snap.data();
                    setRazaoSocial(dados.razaoSocial ?? '');
                    setNomeFantasia(dados.nomeFantasia ?? '');
                    setCnpj(dados.cnpj ?? '');
                    setTelefone(dados.telefone ?? '');
                    setEndereco(dados.endereco ?? '');
                }
            } catch (error) {
                console.log('Erro ao carregar dados da empresa:', error);
            }
        };
        carregarDados();
    }, []);

    const salvarEmpresa = async () => {
        try {
            await setDoc(doc(db, 'configuracoes', 'empresa'), {
                razaoSocial,
                nomeFantasia,
                cnpj,
                telefone,
                endereco,
            }, { merge: true });
            Toast.show({ type: 'success', text1: 'Dados atualizados com sucesso!' });
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erro ao salvar', text2: String(error) });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>Empresa</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Razão Social</Text>
                        <TextInput style={styles.input} value={razaoSocial} onChangeText={setRazaoSocial} />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Nome Fantasia</Text>
                        <TextInput style={styles.input} value={nomeFantasia} onChangeText={setNomeFantasia} />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>CNPJ</Text>
                        <TextInput style={styles.input} value={cnpj} onChangeText={setCnpj} keyboardType="numeric" />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Telefone</Text>
                        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Endereço</Text>
                        <TextInput style={[styles.input, styles.textarea]} value={endereco} onChangeText={setEndereco} multiline />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={salvarEmpresa}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}