import React from "react";
import { FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";

// Props interface tanımı
export interface Post {
  id: number;
  title: string;
}

interface PostListProps {
  posts: Post[];
  onPostPress: (id: number) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostPress }) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.postItem}
          onPress={() => onPostPress(item.id)}
        >
          <Text style={styles.postTitle}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  postItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PostList;
