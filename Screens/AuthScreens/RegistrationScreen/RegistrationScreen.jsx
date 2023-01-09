import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
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
import * as ImagePicker from "expo-image-picker";

import { authSignUpUser } from "../../../redux/auth/authOperations";

const initialState = {
  login: "",
  email: "",
  password: "",
  avatar: "",
};

export function RegistrationScreen({ navigation }) {
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
    if (!userInfo.login || !userInfo.email || !userInfo.password) {
      alert("Parece que você esqueceu de preencher um dos campos");
      return;
    }

    dispatch(authSignUpUser(userInfo));
    setUserInfo(initialState);
    // navigation.navigate("Home");
  };

  const toggleShowPassword = () => {
    setIsHiddenPassword(!isHiddenPassword);
  };

  const addAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setUserInfo((prevState) => ({
        ...prevState,
        avatar: result.assets[0].uri,
      }));
    }
  };

  const deleteAvatar = () => {
    setUserInfo((prevState) => ({
      ...prevState,
      avatar: "",
    }));
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
            <View style={styles.avatar}>
              {userInfo.avatar ? (
                <View>
                  <Image
                    source={{ uri: userInfo.avatar }}
                    style={styles.avatarPhoto}
                  />
                  <TouchableOpacity
                    style={styles.photoBtn}
                    onPress={deleteAvatar}
                  >
                    <AntDesign name="closecircleo" size={25} color="#E8E8E8" />
                    {/* <AntDesign name="pluscircleo" size={25} color="#FF6C00" /> */}
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Image
                    style={styles.avatarPhoto}
                    source={require("../../../assets/images/profile-avatar.png")}
                  />
                  <TouchableOpacity style={styles.photoBtn} onPress={addAvatar}>
                    {/* <AntDesign name="closecircleo" size={25} color="#E8E8E8" /> */}
                    <AntDesign name="pluscircleo" size={25} color="#FF6C00" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View
              style={{ ...styles.form, marginBottom: isShowKeyboard ? 22 : 43 }}
            >
              <Text style={styles.title}>Cadastro</Text>
              <TextInput
                // style={styles.input}
                style={{
                  ...styles.input,
                  borderColor: inFocus ? "#FF6C00" : "#E8E8E8",
                }}
                selectionColor="#FF6C00"
                placeholder="Usuário"
                onFocus={trackingFocus}
                value={userInfo.login}
                onChangeText={(value) =>
                  setUserInfo((prevState) => ({ ...prevState, login: value }))
                }
              />
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: inFocus ? "#FF6C00" : "#E8E8E8",
                }}
                placeholder="E-mail"
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
                  <Text>{isHiddenPassword ? "Amostrar" : "Esconder"}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {!isShowKeyboard && (
              <>
                <View style={styles.btnSignUp}>
                  <TouchableOpacity activeOpacity={0.7} onPress={submitForm}>
                    <Text style={styles.btnSignUpText}>Зарегистрироваться</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.btnHasAccount}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate("LoginScreen")}
                  >
                    <Text style={styles.btnHasAccountText}>
                      Já tem uma conta? Entrar
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
    paddingTop: 92,
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
  btnSignUp: {
    padding: 16,
    height: 51,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSignUpText: {
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
    top: -150,
    left: "35%",
    // position: "absolute",
    // zIndex: 5,
    // top: -150,
    // right: 130,
    // height: 120,
    // width: 120,
    // backgroundColor: "#F6F6F6",
    // borderRadius: 16,
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
    width: 120,
    height: 120,
    borderRadius: 16,
  },
});
