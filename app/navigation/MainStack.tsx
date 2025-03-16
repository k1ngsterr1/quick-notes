import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screens/main-screen";
import AddNoteScreen from "../screens/add-note-screen";
import ProfileScreen from "../screens/profile-screen";
import SettingsScreen from "../screens/settings-screen";

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
      <Stack.Screen name="NotesScreen" component={AddNoteScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
