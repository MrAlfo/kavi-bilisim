import Animated from "react-native-reanimated";

export interface BottomSheetProps {
    isOpen: Animated.SharedValue<boolean>;
    toggleSheet: () => void;
    duration?: number;
    children: React.ReactNode;
  }