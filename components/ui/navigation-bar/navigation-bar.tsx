import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Home, Search, PlusCircle, Bell, User } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useNavigationStore } from "@/stores/use-navigation-store";

export const NavigationBar = () => {
  const navigation = useNavigation();
  const { activePage, changePage } = useNavigationStore();

  const handleTabPress = (screen: string) => {
    changePage(screen);
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.container}>
      {/* Background shape */}
      <View style={styles.background} />

      {/* Navigation items */}
      <View style={styles.navItemsContainer}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress("MainScreen")}
        >
          <Home
            size={24}
            color={activePage === "MainScreen" ? "#FF9800" : "#FFFFFF"}
          />
          <Text
            style={[
              styles.navLabel,
              activePage === "MainScreen" && styles.activeNavLabel,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress("SearchScreen")}
        >
          <Search
            size={24}
            color={activePage === "SearchScreen" ? "#FF9800" : "#FFFFFF"}
          />
          <Text
            style={[
              styles.navLabel,
              activePage === "SearchScreen" && styles.activeNavLabel,
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>

        {/* Spacer for center button */}
        <View style={styles.centerSpacer} />

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress("NotificationsScreen")}
        >
          <Bell
            size={24}
            color={activePage === "NotificationsScreen" ? "#FF9800" : "#FFFFFF"}
          />
          <Text
            style={[
              styles.navLabel,
              activePage === "NotificationsScreen" && styles.activeNavLabel,
            ]}
          >
            Alerts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress("ProfileScreen")}
        >
          <User
            size={24}
            color={activePage === "ProfileScreen" ? "#FF9800" : "#FFFFFF"}
          />
          <Text
            style={[
              styles.navLabel,
              activePage === "ProfileScreen" && styles.activeNavLabel,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Center floating button */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => handleTabPress("CreateScreen")}
      >
        <View style={styles.centerButtonInner}>
          <PlusCircle
            size={32}
            color="#FFFFFF"
            fill={activePage === "CreateScreen" ? "#FF9800" : "transparent"}
            strokeWidth={2}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    position: "relative",
    justifyContent: "flex-end",
  },
  background: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#121212",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },
  activeNavLabel: {
    color: "#FF9800",
    fontWeight: "bold",
  },
  centerSpacer: {
    width: 70,
  },
  centerButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  centerButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFC107",
  },
});
