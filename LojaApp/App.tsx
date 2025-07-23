import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/pages/LoginScreen';
import BottomTabsNavigator from './src/pages/BottomTabsNavigator';
import CadastroProdutoScreen from './src/pages/CadastroProdutoScreen';
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

        </Stack.Navigator>
      </NavigationContainer>
      <Toast />

    </>
  );
}