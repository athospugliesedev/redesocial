import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import { RegistrationScreen } from "../Screens/AuthScreens/RegistrationScreen/RegistrationScreen";
import { LoginScreen } from "../Screens/AuthScreens/LoginScreen/LoginScreen";
import { Home } from "../Screens/Home/Home";

import { authStateChangedUser } from "../redux/auth/authOperations";

SplashScreen.preventAutoHideAsync();

const AuthStack = createNativeStackNavigator();

export default function Main() {
  const { stateChange } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangedUser());
  }, []);

  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthStack.Navigator initialRouteName="LoginScreen">
          {stateChange ? (
            <AuthStack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={Home}
            />
          ) : (
            <>
              <AuthStack.Screen
                options={{ headerShown: false }}
                name="LoginScreen"
                component={LoginScreen}
              />
              <AuthStack.Screen
                options={{ headerShown: false }}
                name="RegistrationScreen"
                component={RegistrationScreen}
              />
            </>
          )}
        </AuthStack.Navigator>

        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}
