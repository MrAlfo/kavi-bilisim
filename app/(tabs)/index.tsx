import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { fetchPostDetails, fetchPosts, fetchUserDetails } from "@/utils/api";
import PostDetail, { Post, User } from "@/components/PostDetails";
import { Stack } from "expo-router";


// BottomSheet Bileşeni
function BottomSheet({
  isOpen,
  toggleSheet,
  duration = 500,
  children,
}: {
  isOpen: Animated.SharedValue<boolean>;
  toggleSheet: () => void;
  duration?: number;
  children: React.ReactNode;
}) {
  const height = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration })
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpen.value ? 1 : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <>
      <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
        <TouchableOpacity style={styles.flex} onPress={toggleSheet} />
      </Animated.View>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[sheetStyles.sheet, sheetStyle]}
      >
        {children}
      </Animated.View>
    </>
  );
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [userDetails, setUserDetails] = useState<User | undefined>(undefined);
  const isOpen = useSharedValue(false);

  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
  };

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    loadPosts();
  }, []);

  const handlePostPress = async (postId: number) => {
    const post = await fetchPostDetails(postId);
    const user = await fetchUserDetails(post.userId);
    setSelectedPost(post);
    setUserDetails(user);
    toggleSheet();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>Post List</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.postItem}
            onPress={() => handlePostPress(item.id)}
          >
            <Text style={styles.postTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
      <BottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        {selectedPost && (
          <View style={styles.sheetContent}>
           <PostDetail post={selectedPost} user={userDetails}/>
          </View>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#2D625F",
  },
  listContainer: {
    padding: 16,
  },
  postItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D625F",
  },
  sheetContent: {
    padding: 20,
    alignItems: "center",
  },
  postDetailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  postDetailBody: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  flex: {
    flex: 1,
  },
});

const sheetStyles = StyleSheet.create({
  sheet: {
    padding: 16,
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});

export default App;
