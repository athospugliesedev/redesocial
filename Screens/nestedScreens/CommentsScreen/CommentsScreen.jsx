import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  View,
  Text,
  StyleSheet,
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import db from "../../../firebase/config";

export const CommentsScreen = ({ route }) => {
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

  const item = route.params.item;
  const photo = route.params.item.photo;
  const postId = route.params.item.id;
  const title = route.params.item.photoTitle;
  const { login, avatar } = useSelector((state) => state.auth);

  useEffect(() => {
    getAllPosts();
  }, []);

  const createPost = async () => {
    Keyboard.dismiss();
    if (!comment) return alert("Esqueci de inserir um comentário");

    const day = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
    }).format(new Date());
    const time = new Intl.DateTimeFormat("en-GB", {
      timeStyle: "short",
    }).format(new Date());

    const date = day + " " + "|" + " " + time;

    await db
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .add({ avatar, comment, login, date });

    await db
      .firestore()
      .collection("posts")
      .doc(postId)
      .set({ ...item, amount: allComments.length + 1 });

    setComment("");
  };

  const getAllPosts = async () => {
    await db
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .onSnapshot((data) =>
        setAllComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 32 }}>
        <Image source={{ uri: photo }} style={styles.photo} />
        {/* <Text>{title}</Text> */}
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={allComments}
          renderItem={({ item }) => (
            <View style={styles.wrap}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{
                    uri: item.avatar
                      ? item.avatar
                      : "../../../assets/images/profile-avatar.png",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 28,
                    marginEnd: 16,
                  }}
                />
              </View>
              <View style={styles.infoWrap}>
                <Text>{item.comment}</Text>
                <Text style={{ fontSize: 10, textAlign: "right" }}>
                  {item.date}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
      <View>
        <TextInput
          value={comment}
          placeholder="Comment"
          placeholderTextColor="#BDBDBD"
          style={styles.commentInput}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={styles.btnSend}
          activeOpacity={0.7}
          onPress={createPost}
        >
          <Feather name="arrow-up" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  avatarWrap: {
    width: 30,
    height: 30,
    borderWidth: 0.05,
    borderRadius: 28,
    marginEnd: 16,
  },
  infoWrap: {
    height: "80%",
    width: 330,
    padding: 16,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  wrap: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 0,
    marginBottom: 24,
  },
  photo: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  btnSend: {
    backgroundColor: "#FF6C00",
    borderRadius: 50,
    position: "absolute",
    right: 8,
    top: 14,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  commentInput: {
    borderRadius: 50,
    padding: 16,
    borderColor: "#E8E8E8",
    borderWidth: 1,
    backgroundColor: "#F6F6F6",
    marginBottom: 7,
  },
});
