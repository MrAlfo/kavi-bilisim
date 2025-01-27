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

const getVisiblePages = (
  totalPages: number,
  currentPage: number,
  siblingCount: number = 1
) => {
  const totalPageNumbers = siblingCount * 2 + 5; // İlk, son, aktif sayfa ve siblingCount kadar sayfa
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const startPages = [1, 2];
  const endPages = [totalPages - 1, totalPages];
  const middlePages = Array.from(
    {
      length: siblingCount * 2 + 1,
    },
    (_, index) => currentPage - siblingCount + index
  ).filter((page) => page > 2 && page < totalPages - 1);

  return [
    ...startPages,
    ...(middlePages[0] > 3 ? ["..."] : []),
    ...middlePages,
    ...(middlePages[middlePages.length - 1] < totalPages - 2 ? ["..."] : []),
    ...endPages,
  ];
};

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
    zIndex: isOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
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

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Pagination için hesaplamalar
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(posts.length / postsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  const visiblePages = getVisiblePages(
    Math.ceil(posts.length / postsPerPage),
    currentPage,
    1 // siblingCount
  );
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>Post List</Text>
      <FlatList
        data={currentPosts}
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

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          style={[
            styles.pageButton,
            currentPage === 1 && styles.disabledButton,
          ]}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>{"<"}</Text>
        </TouchableOpacity>
        {visiblePages.map((page, index) =>
          page === "..." ? (
            <Text key={`ellipsis-${index}`} style={styles.ellipsis}>
              ...
            </Text>
          ) : (
            <TouchableOpacity
              key={`page-${page}`} // Benzersiz bir key kullanıyoruz
              onPress={() => handlePageClick(page as number)}
              style={[
                styles.pageNumber,
                currentPage === page && styles.activePage,
              ]}
            >
              <Text>{page}</Text>
            </TouchableOpacity>
          )
        )}
        <TouchableOpacity
          onPress={handleNextPage}
          style={[
            styles.pageButton,
            currentPage === Math.ceil(posts.length / postsPerPage) &&
              styles.disabledButton,
          ]}
          disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
        >
          <Text style={styles.pageButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        {selectedPost && (
          <View style={styles.sheetContent}>
            <PostDetail post={selectedPost} user={userDetails} />
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
  paginationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  pageButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#2D625F",
    borderRadius: 5,
  },
  pageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageNumber: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  activePage: {
    backgroundColor: "#2D625F",
    borderColor: "#2D625F",
    color: "#fff",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  ellipsis: {
    fontSize: 16,
    marginHorizontal: 5,
    color: "#aaa",
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
