import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserCurrency } from "@/providers/AuthProvider";
import { formatAmount } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Home List Item Link Component
 * Clickable list item showing title and value with colored indicator
 * Matches web app's HomeListItemLink component
 */

type HomeListItemLinkProps = {
  linkTo: string;
  title: string;
  loading: boolean;
  value: number;
  valueColor?: string;
  onPress?: () => void;
};

export const HomeListItemLink = ({
  linkTo,
  title,
  loading,
  value,
  valueColor = "#ccc",
  onPress,
}: HomeListItemLinkProps) => {
  const userCurrency = useUserCurrency();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Colored left indicator bar */}
        <View style={[styles.colorBar, { backgroundColor: valueColor }]} />

        {/* Title and value */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {loading ? (
            <Skeleton width={60} height={19} />
          ) : (
            <Text style={styles.value}>
              {formatAmount(value, userCurrency)}
            </Text>
          )}
        </View>
      </View>

      {/* Arrow icon */}
      <Ionicons name="chevron-forward" size={20} color="#878BAC" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6d7e0",
    borderRadius: 16,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  colorBar: {
    width: 6,
    height: 40,
    borderRadius: 10,
    marginRight: 10,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#181818",
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    color: "#878BAC",
  },
});
