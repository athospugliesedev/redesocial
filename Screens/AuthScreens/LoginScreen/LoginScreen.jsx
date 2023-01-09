import { useEffect, useState } from "react";
import { authSignInUser } from "../../../redux/auth/authOperations";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

const initialState = {
  email: "",
  password: "",
};

export function LoginScreen({ navigation }) {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [inFocus, setInFocus] = useState(false);
  const [userInfo, setUserInfo] = useState(initialState);
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsShowKeyboard(true);
        setInFocus(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsShowKeyboard(false);
        setInFocus(false);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    setInFocus(false);
    Keyboard.dismiss();
  };

  const trackingFocus = () => {
    setIsShowKeyboard(true);
    setInFocus(true);
  };
  const submitForm = () => {
    if (!userInfo.email || !userInfo.password) {
      alert("Parece que você esqueceu de preencher um dos campos");
      return;
    }

    setUserInfo(initialState);
    // navigation.navigate("Home");
    dispatch(authSignInUser(userInfo));
  };

  const toggleShowPassword = () => {
    setIsHiddenPassword(!isHiddenPassword);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../../../assets/images/PhotoBG.jpg")}
        />
        <View style={styles.wrap}>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <View
              style={{ ...styles.form, marginBottom: isShowKeyboard ? 12 : 43 }}
            >
              <Text style={styles.title}>Entrar</Text>
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: inFocus ? "#FF6C00" : "#E8E8E8",
                }}
                placeholder="Email"
                onFocus={trackingFocus}
                value={userInfo.email}
                selectionColor="#FF6C00"
                onChangeText={(value) =>
                  setUserInfo((prevState) => ({ ...prevState, email: value }))
                }
              />
              <View style={styles.passwordInput}>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: inFocus ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Senha"
                  secureTextEntry={isHiddenPassword}
                  onFocus={trackingFocus}
                  value={userInfo.password}
                  selectionColor="#FF6C00"
                  onChangeText={(value) =>
                    setUserInfo((prevState) => ({
                      ...prevState,
                      password: value,
                    }))
                  }
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.btnShowPass}
                  onPress={toggleShowPassword}
                >
                  <Text>{isHiddenPassword ? "Mostrar" : "Esconder"}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {!isShowKeyboard && (
              <>
                <View style={styles.btnSignIn}>
                  <TouchableOpacity activeOpacity={0.7} onPress={submitForm}>
                    <Text style={styles.btnSignInText}>Entrar</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.btnHasAccount}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate("RegistrationScreen")}
                  >
                    <Text style={styles.btnHasAccountText}>
                      Não tem conta? Registre-se
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,
    color: "#212121",
    textAlign: "center",
    marginBottom: 32,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-end",
  },
  wrap: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 32,
    borderRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  form: {
    // marginBottom: 43,
  },
  input: {
    fontFamily: "Roboto-Regular",
    padding: 16,
    marginBottom: 16,
    borderColor: "#E8E8E8",
    placeholderTextColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 15,
  },
  image: {
    position: "absolute",
    flex: 1,
    width: "100%",
    top: 0,
    // resizeMode: "cover",
    // justifyContent: "flex-end",
  },
  passwordInput: {
    position: "relative",
  },
  btnShowPass: {
    fontFamily: "Roboto-Regular",
    position: "absolute",
    right: 16,
    top: 16,
    fontSize: 16,
    color: "#1B4371",
  },
  btnSignIn: {
    padding: 16,
    height: 51,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSignInText: {
    fontFamily: "Roboto-Regular",
    color: "#FFFFFF",
    fontSize: 16,
  },
  btnHasAccount: {
    marginTop: 16,
    marginBottom: 78,
    alignItems: "center",
    justifyContent: "center",
  },
  btnHasAccountText: {
    fontFamily: "Roboto-Regular",
    color: "#1B4371",
    fontSize: 16,
  },
  avatar: {
    position: "absolute",
    zIndex: 5,
    top: -150,
    right: 130,
    height: 120,
    width: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  photoBtn: {
    position: "absolute",
    right: -12,
    bottom: "15%",
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
  },
  avatarPhoto: {
    position: "relative",
  },
});
