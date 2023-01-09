import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import {
  authSignOutUser,
  authStateChangedUser,
} from "../../../redux/auth/authOperations";
import { authSlice } from "../../../redux/auth/authReducer";

const { updateUserProfile } = authSlice.actions;

import db from "../../../firebase/config";

export const ProfileScreen = ({ navigation }) => {
  const { userId, login, avatar } = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [newAvatar, setNewAvatar] = useState("");
  const [likes, setLikes] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    getUserPosts();
    dispatch(authStateChangedUser());
  }, []);

  const getUserPosts = async () => {
    await db
      .firestore()
      .collection("posts")
      .where("userId", "==", userId)
      .onSnapshot((data) =>
        setUserPosts(data.docs.map((doc) => ({ ...doc.data() })))
      );
  };

  const signOut = () => dispatch(authSignOutUser());

  const addAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewAvatar(result.assets[0].uri);

      const user = await db.auth().currentUser;

      const { displayName, photoURL } = await db.auth().currentUser;

      const response = await fetch(newAvatar);
      const file = await response.blob();

      await db.storage().ref(`avatar/${userId}`).put(file);

      const processedAvatar = await db
        .storage()
        .ref("avatar")
        .child(userId)
        .getDownloadURL();

      await user.updateProfile({
        displayName: login,
        photoURL: processedAvatar,
      });

      const userUpdateProfile = {
        login: displayName,
        userId: userId,
        avatar: photoURL,
      };

      dispatch(updateUserProfile(userUpdateProfile));
    }
  };

  const EmptyListMessage = () => {
    return (
      <Text style={{ textAlign: "center", fontSize: 25 }}>
        You don't have any posts yet
      </Text>
    );
  };

  const deleteAvatar = () => {
    setUserInfo((prevState) => ({
      ...prevState,
      avatar: "",
    }));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/PhotoBG.jpg")}
        style={styles.bgImage}
      >
        <View style={styles.background}>
          <View style={{ position: "absolute", top: 24, right: 16 }}>
            <TouchableOpacity activeOpacity={0.7} onPress={signOut}>
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              top: -60,
              left: "39%",
            }}
          >
            {avatar ? (
              <>
                <Image source={{ uri: avatar }} style={styles.avatarPhoto} />
                {/* <TouchableOpacity
                  style={styles.addButton}
                  onPress={deleteAvatar}
                >
                  <AntDesign name="closecircleo" size={25} color="#E8E8E8" />
                 
                </TouchableOpacity> */}
              </>
            ) : (
              <>
                <Image
                  source={require("../../../assets/images/profile-avatar.png")}
                  style={styles.avatarPhoto}
                />
              </>
            )}
            <TouchableOpacity style={styles.addButton} onPress={addAvatar}>
              <AntDesign name="pluscircleo" size={25} color="#FF6C00" />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.addButton} onPress={addAvatar}>
              <AntDesign name="closecircleo" size={25} color="#E8E8E8" />
            </TouchableOpacity> */}
          </View>
          <View style={{ marginBottom: 33 }}>
            <Text style={styles.userName}>{login}</Text>
          </View>
          <FlatList
            data={userPosts}
            ListEmptyComponent={EmptyListMessage}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 32 }}>
                <Image source={{ uri: item.photo }} style={styles.photo} />
                <Text>{item.photoTitle}</Text>
                <View style={styles.infoWrap}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{ ...styles.comments, marginRight: 24 }}
                      onPress={() => {
                        navigation.navigate("Comments", { item });
                      }}
                    >
                      <Feather
                        name="message-circle"
                        size={24}
                        color={"#BDBDBD"}
                        style={{ transform: [{ scaleX: -1 }] }}
                      />

                      <Text
                        style={{
                          ...styles.commentsCount,
                          color: "#212121",
                        }}
                      >
                        {item.amount}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.comments}>
                      <Feather
                        name="thumbs-up"
                        size={24}
                        color={item.likes ? "#FF6C00" : "#BDBDBD"}
                      />

                      <Text
                        style={{
                          ...styles.commentsCount,
                          color: item.likes ? "#212121" : "#BDBDBD",
                        }}
                      >
                        {item.likes ? item.likes : 0}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.place}
                    onPress={() =>
                      navigation.navigate("Map", { location: item.location })
                    }
                  >
                    <Feather name="map-pin" size={24} color="#BDBDBD" />
                    <Text style={styles.placeName}>{item.place}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    // paddingHorizontal: 16,
    // paddingTop: 32,
  },
  profile: {
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: 32,
  },
  avatarPhoto: {
    height: 120,
    width: 120,
    borderRadius: 16,
  },
  profileInfo: {
    marginTop: 16,
    marginLeft: 8,
  },
  name: {
    color: "#212121",
    fontSize: 13,
    lineHeight: 15,
  },
  email: {
    fontSize: 11,
    lineHeight: 13,
    color: "rgba(33, 33, 33, 0.8)",
  },
  photo: {
    height: 240,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  comments: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  commentsCount: {
    fontSize: 16,
    lineHeight: 19,
    marginLeft: 9,
  },
  place: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  placeName: {
    color: "#212121",
    fontSize: 16,
    lineHeight: 19,
    marginLeft: 9,
    textDecorationLine: "underline",
  },
  background: {
    height: 600,
    paddingTop: 92,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: "relative",
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "transparent",
    // padding: 6,
    position: "absolute",
    top: "60%",
    right: -15,
  },
  userName: {
    fontFamily: "Roboto-Medium",
    color: "#212121",
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
  },
});
