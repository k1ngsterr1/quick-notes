import { NavigationBar } from "@/components/ui/navigation-bar/navigation-bar";
import { Plus, Search, X } from "lucide-react-native";
import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const STORAGE_KEY = "@trader_journal_data";
const ID_COUNTER_KEY = "@trader_journal_id_counter";

// Initial trades data with proper structure
const initialTrades = [
  {
    id: "1",
    title: "AAPL Long",
    content: "Entry: $175.50, TP: $185, SL: $170\nR:R = 1.9, Size: 10 shares",
    date: "2 hours ago",
    pnl: "+2.5%",
    type: "long",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "BTC/USD Short",
    content:
      "Entry: $65,400, TP: $63,000, SL: $66,500\nFib retracement at 0.618",
    date: "Yesterday",
    pnl: "-1.2%",
    type: "short",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "EUR/USD Long",
    content:
      "Entry: 1.0850, TP: 1.0950, SL: 1.0800\nRSI oversold, bullish divergence",
    date: "3 days ago",
    pnl: "+0.8%",
    type: "long",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Trading Rules",
    content:
      "1. Never risk more than 2%\n2. Wait for confirmation\n3. Follow the trend",
    date: "Last week",
    type: "note",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    title: "Position Sizing Formula",
    content: "Position Size = (Account × Risk%) ÷ (Entry - Stop Loss)",
    date: "Last week",
    type: "formula",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MainScreen = ({ navigation }) => {
  const [trades, setTrades] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Format relative time for display
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "Unknown date";

    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60)
      return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
    if (diffHour < 24)
      return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`;
    if (diffDay < 7) return `${diffDay} ${diffDay === 1 ? "day" : "days"} ago`;
    if (diffDay < 30)
      return `${Math.floor(diffDay / 7)} ${
        Math.floor(diffDay / 7) === 1 ? "week" : "weeks"
      } ago`;

    return date.toLocaleDateString();
  };

  // Load trades from AsyncStorage
  const loadTrades = async () => {
    try {
      setIsLoading(true);
      const storedTrades = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedTrades !== null) {
        const parsedTrades = JSON.parse(storedTrades);

        // Update the relative time for each trade
        const tradesWithFormattedDates = parsedTrades.map((trade) => ({
          ...trade,
          date: trade.timestamp
            ? formatRelativeTime(trade.timestamp)
            : trade.date,
        }));

        setTrades(tradesWithFormattedDates);
      } else {
        // If no data exists, initialize with default data and save it
        const initialTradesWithDates = initialTrades.map((trade) => ({
          ...trade,
          date: formatRelativeTime(trade.timestamp),
        }));

        setTrades(initialTradesWithDates);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialTrades));

        // Initialize ID counter to the highest ID in initial trades
        const maxId = Math.max(
          ...initialTrades.map((trade) => parseInt(trade.id, 10))
        );
        await AsyncStorage.setItem(ID_COUNTER_KEY, maxId.toString());
      }
    } catch (error) {
      console.error("Failed to load trades from storage", error);
      Alert.alert("Error", "Failed to load your trades");
      // Fallback to initial data if loading fails
      setTrades(initialTrades);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTrades();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTrades();
    }, [])
  );

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadTrades();
  };

  // Delete a trade
  const deleteTrade = async (id) => {
    try {
      const updatedTrades = trades.filter((trade) => trade.id !== id);
      setTrades(updatedTrades);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrades));
    } catch (error) {
      console.error("Failed to delete trade", error);
      Alert.alert("Error", "Failed to delete trade");
      // Reload trades to ensure UI is in sync with storage
      loadTrades();
    }
  };

  // Filter trades based on search query and active tab
  const filteredTrades = trades.filter((trade) => {
    const matchesSearch =
      trade.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "trades")
      return matchesSearch && (trade.type === "long" || trade.type === "short");
    if (activeTab === "formulas")
      return matchesSearch && trade.type === "formula";

    return matchesSearch;
  });

  const getCardColor = (type) => {
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

  // Handle long press to delete a trade
  const handleLongPress = (trade) => {
    Alert.alert(
      "Delete Trade",
      `Are you sure you want to delete "${trade.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTrade(trade.id),
        },
      ]
    );
  };

  // Navigate to add note screen
  const handleAddNote = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate("AddNote");
    } else {
      Alert.alert("Navigation", "Navigation is not available");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trader's Journal</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#FFF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search trades & formulas..."
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color="#777" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "trades" && styles.activeTab]}
          onPress={() => setActiveTab("trades")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "trades" && styles.activeTabText,
            ]}
          >
            Trades
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "formulas" && styles.activeTab]}
          onPress={() => setActiveTab("formulas")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "formulas" && styles.activeTabText,
            ]}
          >
            Formulas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Trades list */}
      <ScrollView
        style={styles.tradesContainer}
        contentContainerStyle={styles.tradesContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF9800"]}
            tintColor="#FF9800"
          />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading trades...</Text>
          </View>
        ) : filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <TouchableOpacity
              key={trade.id}
              style={[
                styles.tradeCard,
                { backgroundColor: getCardColor(trade.type) },
              ]}
              onLongPress={() => handleLongPress(trade)}
              delayLongPress={500}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.tradeTitle}>{trade.title}</Text>
                {trade.pnl && (
                  <Text
                    style={[
                      styles.tradePnL,
                      trade.pnl.startsWith("+")
                        ? styles.profitText
                        : styles.lossText,
                    ]}
                  >
                    {trade.pnl}
                  </Text>
                )}
              </View>
              <Text style={styles.tradeContent}>{trade.content}</Text>
              <Text style={styles.tradeDate}>{trade.date}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trades or formulas found</Text>
          </View>
        )}
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    paddingVertical: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#1E1E1E",
  },
  activeTab: {
    backgroundColor: "#FF9800",
  },
  tabText: {
    color: "#FFF",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000",
  },
  tradesContainer: {
    flex: 1,
  },
  tradesContent: {
    padding: 16,
    paddingBottom: 80,
  },
  tradeCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tradeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  tradePnL: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profitText: {
    color: "#006400",
  },
  lossText: {
    color: "#8B0000",
  },
  tradeContent: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    lineHeight: 20,
  },
  tradeDate: {
    fontSize: 12,
    color: "#333",
    textAlign: "right",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default MainScreen;
