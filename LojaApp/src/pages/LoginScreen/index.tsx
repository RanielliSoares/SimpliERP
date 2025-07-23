import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  // 🔄 Recupera email e senha salvos no AsyncStorage
  useEffect(() => {
    const loadCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedSenha = await AsyncStorage.getItem('senha');
      if (savedEmail && savedSenha) {
        setEmail(savedEmail);
        setSenha(savedSenha);
        setRememberMe(true);
      }
    };
    loadCredentials();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      setErrorMessage('');

      if (rememberMe) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('senha', senha);
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('senha');
      }

      navigation.navigate('Home');
    } catch (error: any) {
      let msg = 'Erro ao logar. Verifique suas credenciais.';

      if (error.code === 'auth/invalid-email') msg = 'Email inválido.';
      else if (error.code === 'auth/user-not-found') msg = 'Usuário não encontrado.';
      else if (error.code === 'auth/wrong-password') msg = 'Senha incorreta.';
      else if (error.code === 'auth/too-many-requests') msg = 'Muitas tentativas. Tente novamente mais tarde.';

      setErrorMessage(msg);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="shopping-outline" size={48} color="#f63b92ff" />
      </View>

      <Text style={styles.title}>Loja App</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={rememberMe}
          onValueChange={setRememberMe}
          color={rememberMe ? '#f63b92ff' : undefined}
        />
        <Text style={styles.checkboxLabel}>Lembrar-me</Text>
      </View>

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {errorMessage !== '' && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
}