import { createStackNavigator } from "@react-navigation/stack";

import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { authSignOutUser } from "../../redux/auth/authOperations";
import { Feather } from "@expo/vector-icons";
import { DefaultScreen } from "../nestedScreens/DefaultScreen/DefaultScreen";
import { CommentsScreen } from "../nestedScreens/CommentsScreen/CommentsScreen";
import { MapScreen } from "../nestedScreens/MapScreen/MapScreen";
import { useDispatch } from "react-redux";

const NestedScreen = createStackNavigator();

export function PostsScreen({ navigation }) {
  const dispatch = useDispatch();
  const signOut = () => dispatch(authSignOutUser());

  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultScreen}
        options={{
          headerBackTitle: false,
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 10, marginBottom: 10 }}
              activeOpacity={0.7}
              onPress={signOut}
            >
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
      />
      <NestedScreen.Screen name="Comments" component={CommentsScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
}
