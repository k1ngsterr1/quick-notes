// @ts-nocheck

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLeft,
  BarChart3,
  ChevronRight,
  Clock,
  DollarSign,
  Edit2,
  Moon,
  Percent,
  Settings,
  TrendingUp,
  User,
} from "lucide-react-native";
import { NavigationBar } from "@/components/ui/navigation-bar/navigation-bar";
import { useNavigation } from "@react-navigation/native";

const STORAGE_KEY = "@trader_journal_data";
const USER_SETTINGS_KEY = "@trader_journal_user_settings";

const defaultSettings = {
  name: "Trader",
  darkMode: true,
  currency: "USD",
  riskPerTrade: 2, // percentage
  accountSize: 10000,
  showPnLInHome: true,
};

const ProfileScreen = () => {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrades: 0,
    winRate: 0,
    avgProfit: 0,
    avgLoss: 0,
    profitFactor: 0,
    bestTrade: 0,
    worstTrade: 0,
    longWinRate: 0,
    shortWinRate: 0,
  });
  const [userSettings, setUserSettings] = useState(defaultSettings);
  const navigation = useNavigation();

  // Load trades and calculate statistics
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load trades
        const storedTrades = await AsyncStorage.getItem(STORAGE_KEY);
        const parsedTrades = storedTrades ? JSON.parse(storedTrades) : [];
        setTrades(parsedTrades);

        // Load user settings
        const storedSettings = await AsyncStorage.getItem(USER_SETTINGS_KEY);
        if (storedSettings) {
          setUserSettings(JSON.parse(storedSettings));
        } else {
          // Initialize with default settings if none exist
          await AsyncStorage.setItem(
            USER_SETTINGS_KEY,
            JSON.stringify(defaultSettings)
          );
        }

        // Calculate statistics
        calculateStats(parsedTrades);
      } catch (error) {
        console.error("Failed to load data", error);
        Alert.alert("Error", "Failed to load your trading data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate trading statistics
  const calculateStats = (tradeData) => {
    if (!tradeData || tradeData.length === 0) {
      return;
    }

    // Filter only trades with PnL (long and short positions)
    const tradesWithPnL = tradeData.filter(
      (trade) => trade.type === "long" || trade.type === "short"
    );

    if (tradesWithPnL.length === 0) {
      return;
    }

    // Extract PnL values and convert to numbers
    const pnlValues = tradesWithPnL.map((trade) => {
      const pnlStr = trade.pnl || "+0%";
      return (
        parseFloat(pnlStr.replace(/[^-\d.]/g, "")) *
        (pnlStr.includes("-") ? -1 : 1)
      );
    });

    // Winning and losing trades
    const winningTrades = pnlValues.filter((pnl) => pnl > 0);
    const losingTrades = pnlValues.filter((pnl) => pnl < 0);

    // Long and short trades
    const longTrades = tradesWithPnL.filter((trade) => trade.type === "long");
    const shortTrades = tradesWithPnL.filter((trade) => trade.type === "short");

    // Calculate long win rate
    const winningLongTrades = longTrades.filter((trade) => {
      const pnlStr = trade.pnl || "+0%";
      return !pnlStr.includes("-");
    });

    // Calculate short win rate
    const winningShortTrades = shortTrades.filter((trade) => {
      const pnlStr = trade.pnl || "+0%";
      return !pnlStr.includes("-");
    });

    // Calculate statistics
    const totalProfit = winningTrades.reduce((sum, pnl) => sum + pnl, 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, pnl) => sum + pnl, 0));

    setStats({
      totalTrades: tradesWithPnL.length,
      winRate: (winningTrades.length / tradesWithPnL.length) * 100,
      avgProfit:
        winningTrades.length > 0 ? totalProfit / winningTrades.length : 0,
      avgLoss: losingTrades.length > 0 ? totalLoss / losingTrades.length : 0,
      profitFactor:
        totalLoss > 0
          ? totalProfit / totalLoss
          : totalProfit > 0
          ? Infinity
          : 0,
      bestTrade: Math.max(...pnlValues),
      worstTrade: Math.min(...pnlValues),
      longWinRate:
        longTrades.length > 0
          ? (winningLongTrades.length / longTrades.length) * 100
          : 0,
      shortWinRate:
        shortTrades.length > 0
          ? (winningShortTrades.length / shortTrades.length) * 100
          : 0,
    });
  };

  // Toggle dark mode
  const toggleDarkMode = async () => {
    try {
      const updatedSettings = {
        ...userSettings,
        darkMode: !userSettings.darkMode,
      };
      setUserSettings(updatedSettings);
      await AsyncStorage.setItem(
        USER_SETTINGS_KEY,
        JSON.stringify(updatedSettings)
      );
    } catch (error) {
      console.error("Failed to update settings", error);
      Alert.alert("Error", "Failed to update settings");
    }
  };

  // Navigate to edit profile
  const handleEditProfile = () => {
    // In a real app, this would navigate to an edit profile screen
    Alert.alert(
      "Edit Profile",
      "This would navigate to the edit profile screen"
    );
  };

  // Navigate to settings
  const handleSettings = () => {
    navigation.navigate("Settings" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation && navigation.goBack) {
              navigation.goBack();
            }
          }}
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trader Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettings}
        >
          <Settings size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        {/* Trading Statistics */}
        <View style={styles.sectionHeader}>
          <BarChart3 size={20} color="#FF9800" />
          <Text style={styles.sectionTitle}>Trading Statistics</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#FF9800"
            style={styles.loader}
          />
        ) : (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalTrades}</Text>
                <Text style={styles.statLabel}>Total Trades</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats.winRate.toFixed(1)}%
                </Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats.avgProfit > 0 ? "+" : ""}
                  {stats.avgProfit.toFixed(1)}%
                </Text>
                <Text style={styles.statLabel}>Avg. Win</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats.avgLoss > 0 ? "" : "-"}
                  {stats.avgLoss.toFixed(1)}%
                </Text>
                <Text style={styles.statLabel}>Avg. Loss</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats.profitFactor.toFixed(2)}
                </Text>
                <Text style={styles.statLabel}>Profit Factor</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats.bestTrade > 0 ? "+" : ""}
                  {stats.bestTrade.toFixed(1)}%
                </Text>
                <Text style={styles.statLabel}>Best Trade</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats.longWinRate.toFixed(1)}%
                </Text>
                <Text style={styles.statLabel}>Long Win Rate</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {stats.shortWinRate.toFixed(1)}%
                </Text>
                <Text style={styles.statLabel}>Short Win Rate</Text>
              </View>
            </View>
          </View>
        )}
        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Clock size={20} color="#FF9800" />
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.activityContainer}>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color="#FF9800"
              style={styles.loader}
            />
          ) : trades.length > 0 ? (
            trades.slice(0, 3).map((trade) => (
              <View key={trade.id} style={styles.activityItem}>
                <View
                  style={[
                    styles.activityDot,
                    { backgroundColor: getActivityColor(trade.type) },
                  ]}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{trade.title}</Text>
                  <Text style={styles.activityDate}>{trade.date}</Text>
                </View>
                {trade.pnl && (
                  <Text
                    style={[
                      styles.activityPnL,
                      trade.pnl.startsWith("+")
                        ? styles.profitText
                        : styles.lossText,
                    ]}
                  >
                    {trade.pnl}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent activity</Text>
          )}

          {trades.length > 3 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => {
                if (navigation && navigation.navigate) {
                  navigation.navigate("Main");
                }
              }}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#FF9800" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <NavigationBar />
    </SafeAreaView>
  );
};

// Helper function to get activity dot color
const getActivityColor = (type) => {
  switch (type) {
    case "long":
      return "#4CAF50"; // Green for long positions
    case "short":
      return "#F44336"; // Red for short positions
    case "formula":
      return "#2196F3"; // Blue for formulas
    default:
      return "#FFC107"; // Yellow for notes
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: "#AAA",
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 8,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    width: "48%",
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#AAA",
  },
  settingsContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: "#FFF",
  },
  settingValue: {
    fontSize: 16,
    color: "#FF9800",
    fontWeight: "500",
  },
  activityContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginBottom: 80,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: "#AAA",
  },
  activityPnL: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profitText: {
    color: "#4CAF50",
  },
  lossText: {
    color: "#F44336",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: "#FF9800",
    marginRight: 4,
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    padding: 20,
  },
});

export default ProfileScreen;
