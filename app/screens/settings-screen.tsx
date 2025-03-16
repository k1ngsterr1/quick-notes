import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationBar } from "@/components/ui/navigation-bar/navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLeft,
  Check,
  User,
  Moon,
  Bell,
  Trash2,
  LogOut,
  Shield,
  HelpCircle,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useNavigationStore } from "@/stores/use-navigation-store";

const SETTINGS_KEY = "@trader_journal_settings";

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { changePage } = useNavigationStore();
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);

        if (storedSettings !== null) {
          const settings = JSON.parse(storedSettings);
          setUsername(settings.username || "");
          setOriginalUsername(settings.username || "");
          setDarkMode(
            settings.darkMode !== undefined ? settings.darkMode : true
          );
          setNotifications(
            settings.notifications !== undefined ? settings.notifications : true
          );
        }
      } catch (error) {
        console.error("Failed to load settings", error);
        Alert.alert("Error", "Failed to load your settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage
  const saveSettings = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const settings = {
        username,
        darkMode,
        notifications,
      };

      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setOriginalUsername(username);

      Alert.alert("Success", "Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings", error);
      Alert.alert("Error", "Failed to save your settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    return username !== originalUsername;
  };

  // Handle back button press
  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Do you want to save them before leaving?",
        [
          { text: "Don't Save", onPress: () => navigation.goBack() },
          { text: "Cancel", style: "cancel" },
          {
            text: "Save",
            onPress: async () => {
              await saveSettings();
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9800" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
        <NavigationBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveSettings}
          disabled={isSaving || !hasUnsavedChanges()}
        >
          <Check
            size={24}
            color={isSaving || !hasUnsavedChanges() ? "#777" : "#FFF"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("PrivacyScreen" as never)}
          >
            <View style={styles.settingLabelContainer}>
              <Shield size={20} color="#FF9800" />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Trader's Journal v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // bg color from Tailwind config
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF9800", // main color from Tailwind config
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: "#FFF",
    marginLeft: 12,
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 8,
    color: "#FFF",
    fontSize: 16,
    width: "60%",
    textAlign: "right",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  dangerButtonText: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  versionText: {
    color: "#777",
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800", // main color from Tailwind config
    padding: 16,
    borderRadius: 8,
    marginVertical: 24,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
});

export default SettingsScreen;
