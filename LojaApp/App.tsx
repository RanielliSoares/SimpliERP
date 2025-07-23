import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/pages/LoginScreen';
import BottomTabsNavigator from './src/pages/BottomTabsNavigator';
import CadastroProdutoScreen from './src/pages/CadastroProdutoScreen';
import CadastroClienteScreen from './src/pages/CadastroClienteScreen';
import EmpresaScreen from './src/pages/EmpresaScreen';
import FormasPagamentoScreen from './src/pages/FormasPagamentoScreen';
import NovaVendaScreen from './src/pages/NovaVendaScreen';
import ResumoVendaScreen from './src/pages/ResumoVendaScreen';
import Toast from 'react-native-toast-message';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={BottomTabsNavigator} />
          <Stack.Screen name="CadastroProduto" component={CadastroProdutoScreen} />
          <Stack.Screen name="CadastroCliente" component={CadastroClienteScreen} />
          <Stack.Screen name="Empresa" component={EmpresaScreen} />
          <Stack.Screen name="FormasPagamento" component={FormasPagamentoScreen} />
          <Stack.Screen name="NovaVenda" component={NovaVendaScreen} />
          <Stack.Screen name="ResumoVenda" component={ResumoVendaScreen} />
          {/* Adicione outras telas aqui */}
          {/* <Stack.Screen name="OutraTela" component={OutraTela} /> */}
          {/* Adicione outras telas aqui */}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />

    </>
  );
}