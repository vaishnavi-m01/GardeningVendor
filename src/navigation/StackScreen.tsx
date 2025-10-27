import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/type';
import Splash from '../screens/Splash';
import Tabs from './Tabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }}
        />
        <Stack.Screen name="MainTabs" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
