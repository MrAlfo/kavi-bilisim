import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface Post {
  id: number; // Postun benzersiz kimliği
  title: string; // Post başlığı
  body: string; // Post içeriği
  userId: number; // Postu paylaşan kullanıcı kimliği
}

export interface User {
  id: number; // Kullanıcının benzersiz kimliği
  name: string; // Kullanıcının tam adı
  email: string; // Kullanıcının e-posta adresi
}

interface PostDetailProps {
  post: Post;
  user?: User;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, user }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text>{post.body}</Text>
      <View style={styles.userInfo}>
        <Text>Shared by: {user?.name ?? ''}</Text>
        <Text>Email: {user?.email ?? ""}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
});

export default PostDetail;
