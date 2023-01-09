import { useEffect, useState } from "react";

import db from "../../../firebase/config.js";

import { Feather } from "@expo/vector-icons";

import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";

export const DefaultScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  // const [isLiked, setIsLiked] = useState(false);
  const { login, email, avatar } = useSelector((state) => state.auth);

  const getAllPost = async () => {
    await db
      .firestore()
      .collection("posts")
      .onSnapshot((data) =>
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
  };

  const onLikes = async (item) => {
    let likes = item.likes + 1;
    await db
      .firestore()
      .collection("posts")
      .doc(item.id)
      .set({ ...item, likes, likedId: item.userId });
  };

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View>
          <Image style={styles.avatarPhoto} source={{ uri: avatar }} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{login}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
      <FlatList
        data={posts}
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

                <TouchableOpacity
                  // disabled={item.isLiked}
                  style={styles.comments}
                  onPress={() => onLikes(item)}
                >
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  profile: {
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: 32,
  },
  avatarPhoto: {
    height: 60,
    width: 60,
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
});
