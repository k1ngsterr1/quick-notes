import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Platform,
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
} from "react-native";
import { NavigationBar } from "../navigation-bar/navigation-bar";

interface ISafeAreaLayout {
  children: React.ReactNode;
  isAuth?: boolean;
  width?: number; // Optional width prop
}

export const SafeAreaLayout = ({
  children,
  isAuth = false,
  width,
}: ISafeAreaLayout) => {
  const { width: screenWidth } = Dimensions.get("window"); // Get device screen width

  // Logic to determine the width
  const dynamicWidth =
    Platform.OS === "ios"
      ? width ?? 380 // Default to 380 for iOS, but allow passing custom width
      : width || screenWidth; // Use full screen width for Android if no custom width is passed

  return (
    <>
      <StatusBar translucent />
      <SafeAreaView style={[styles.safeArea, { width: dynamicWidth }]}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>{children}</View>
        </ScrollView>
        <NavigationBar />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Ensures it takes the full screen height
    alignSelf: "center", // Centers it horizontally when width is custom
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  darkBackground: {
    backgroundColor: "#0F0F11",
  },
  lightBackground: {
    backgroundColor: "transparent",
  },
});
