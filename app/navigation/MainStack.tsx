import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screens/main-screen";

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainScreen"
      screenOptions={{
        animation: "fade",
        gestureEnabled: true,
        headerShown: false,
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="MainScreen" component={MainScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
