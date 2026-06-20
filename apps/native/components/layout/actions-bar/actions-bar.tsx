import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { actionsBarStyles as styles } from "./actions-bar-styles";

/**
 * Actions Bar Component
 * Month navigation with previous/next buttons
 * Similar to web app's ActionsBar
 */

type ActionsBarProps = {
  pageDate: Date;
  onClickNext: () => void;
  onClickPrevious: () => void;
};

export function ActionsBar({
  pageDate,
  onClickNext,
  onClickPrevious,
}: ActionsBarProps) {
  // Format date as "MMM YYYY" (e.g., "Jan 2025")
  const monthYear = pageDate.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        {/* Previous Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={onClickPrevious}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#181818" />
        </TouchableOpacity>

        {/* Date Display */}
        <Text style={styles.dateText}>{monthYear}</Text>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={onClickNext}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={28} color="#181818" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
