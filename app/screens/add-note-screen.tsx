import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Check } from "lucide-react-native";
import { NavigationBar } from "@/components/ui/navigation-bar/navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const STORAGE_KEY = "@trader_journal_data";
const ID_COUNTER_KEY = "@trader_journal_id_counter";

const AddNoteScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("note"); // Default type
  const [pnl, setPnl] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Format PnL input to ensure it has a percentage sign
  const handlePnlChange = (text: any) => {
    // Remove any existing % signs first
    let cleanedText = text.replace(/%/g, "");

    // If the text is empty, just set it as is
    if (!cleanedText) {
      setPnl("");
      return;
    }

    // Make sure it has a + or - prefix
    if (!cleanedText.startsWith("+") && !cleanedText.startsWith("-")) {
      if (type === "long") {
        cleanedText = "+" + cleanedText;
      } else if (type === "short") {
        cleanedText = "-" + cleanedText;
      } else {
        cleanedText = "+" + cleanedText;
      }
    }

    // Add % sign if it doesn't end with one
    if (!cleanedText.endsWith("%")) {
      cleanedText = cleanedText + "%";
    }

    setPnl(cleanedText);
  };

  // Format price inputs to ensure they have dollar signs
  const formatPriceInput = (text: any, setter: any) => {
    // Remove any existing $ signs first
    let cleanedText = text.replace(/\$/g, "");

    // If the text is empty, just set it as is
    if (!cleanedText) {
      setter("");
      return;
    }

    // Add $ sign if it doesn't start with one
    if (!cleanedText.startsWith("$")) {
      cleanedText = "$" + cleanedText;
    }

    setter(cleanedText);
  };

  // Auto-add appropriate sign when type changes
  useEffect(() => {
    if (pnl && !pnl.includes("%")) {
      handlePnlChange(pnl);
    }

    // Auto-update PnL sign based on trade type
    if (pnl && (type === "long" || type === "short")) {
      let value = pnl.replace(/[+-%]/g, "");
      if (type === "long" && !pnl.startsWith("+")) {
        setPnl(`+${value}%`);
      } else if (type === "short" && !pnl.startsWith("-")) {
        setPnl(`-${value}%`);
      }
    }
  }, [type, pnl]);

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple saves

    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your note");
      return;
    }

    setIsSaving(true);

    try {
      // Get the next ID from AsyncStorage
      let nextId = 1;
      const storedIdCounter = await AsyncStorage.getItem(ID_COUNTER_KEY);

      if (storedIdCounter !== null) {
        nextId = parseInt(storedIdCounter, 10) + 1;
      }

      // Create the new trade object with auto-incremented ID
      const newTrade = {
        id: nextId.toString(),
        title,
        content: formatContent(),
        type,
        date: "Just now",
        timestamp: new Date().toISOString(), // Add timestamp for sorting
      };

      // Add PnL if it's a trade type
      if ((type === "long" || type === "short") && pnl) {
        newTrade.pnl = pnl;
      }

      // Get existing trades from AsyncStorage
      const storedTrades = await AsyncStorage.getItem(STORAGE_KEY);
      let trades = [];

      if (storedTrades !== null) {
        trades = JSON.parse(storedTrades);
      }

      // Add new trade to the array
      trades.unshift(newTrade); // Add to beginning of array

      // Save updated trades back to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trades));

      // Update the ID counter
      await AsyncStorage.setItem(ID_COUNTER_KEY, nextId.toString());

      Alert.alert("Success", "Trade note added successfully!");

      // Clear form fields
      setTitle("");
      setContent("");
      setPnl("");
      setEntryPrice("");
      setTargetPrice("");
      setStopLoss("");

      // Navigate back to main screen
      if (navigation && navigation.goBack) {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Failed to save trade", error);
      Alert.alert("Error", "Failed to save your trade note");
    } finally {
      setIsSaving(false);
    }
  };

  // Format content based on type
  const formatContent = () => {
    if (type === "long" || type === "short") {
      let formattedContent = content ? content + "\n\n" : "";

      if (entryPrice) {
        formattedContent += `Entry: ${entryPrice}`;
      }

      if (targetPrice) {
        formattedContent += formattedContent ? ", " : "";
        formattedContent += `TP: ${targetPrice}`;
      }

      if (stopLoss) {
        formattedContent += formattedContent ? ", " : "";
        formattedContent += `SL: ${stopLoss}`;
      }

      // Calculate R:R if both target and stop loss are provided
      if (targetPrice && stopLoss && entryPrice) {
        try {
          const entry = parseFloat(entryPrice.replace(/[^\d.-]/g, ""));
          const target = parseFloat(targetPrice.replace(/[^\d.-]/g, ""));
          const stop = parseFloat(stopLoss.replace(/[^\d.-]/g, ""));

          if (
            !isNaN(entry) &&
            !isNaN(target) &&
            !isNaN(stop) &&
            entry !== stop
          ) {
            const risk = Math.abs(entry - stop);
            const reward = Math.abs(target - entry);
            const rr = (reward / risk).toFixed(2);

            formattedContent += `\nR:R = ${rr}`;
          }
        } catch (e) {
          // Silently fail if calculation isn't possible
        }
      }

      return formattedContent;
    }

    return content;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (navigation && navigation.goBack) {
                navigation.goBack();
              } else {
                Alert.alert(
                  "Navigation",
                  "This would go back to the main screen"
                );
              }
            }}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Trade Note</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Check size={24} color={isSaving ? "#777" : "#FFF"} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title..."
              placeholderTextColor="#777"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "long" && styles.selectedTypeButton,
                  { backgroundColor: type === "long" ? "#4CAF50" : "#1E1E1E" },
                ]}
                onPress={() => setType("long")}
              >
                <Text style={styles.typeButtonText}>Long</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "short" && styles.selectedTypeButton,
                  { backgroundColor: type === "short" ? "#F44336" : "#1E1E1E" },
                ]}
                onPress={() => setType("short")}
              >
                <Text style={styles.typeButtonText}>Short</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "formula" && styles.selectedTypeButton,
                  {
                    backgroundColor: type === "formula" ? "#2196F3" : "#1E1E1E",
                  },
                ]}
                onPress={() => setType("formula")}
              >
                <Text style={styles.typeButtonText}>Formula</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "note" && styles.selectedTypeButton,
                  { backgroundColor: type === "note" ? "#FFC107" : "#1E1E1E" },
                ]}
                onPress={() => setType("note")}
              >
                <Text style={styles.typeButtonText}>Note</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Trade-specific fields */}
          {(type === "long" || type === "short") && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>P&L</Text>
                <TextInput
                  style={styles.input}
                  placeholder={type === "long" ? "+2.5%" : "-1.2%"}
                  placeholderTextColor="#777"
                  value={pnl}
                  onChangeText={handlePnlChange}
                  keyboardType="numbers-and-punctuation"
                  onBlur={() => {
                    // Ensure % is added when field loses focus
                    if (pnl && !pnl.endsWith("%")) {
                      setPnl(pnl + "%");
                    }
                  }}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Entry Price</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="$175.50"
                    placeholderTextColor="#777"
                    value={entryPrice}
                    onChangeText={(text) =>
                      formatPriceInput(text, setEntryPrice)
                    }
                    keyboardType="numbers-and-punctuation"
                    onBlur={() => {
                      // Ensure $ is added when field loses focus
                      if (entryPrice && !entryPrice.startsWith("$")) {
                        setEntryPrice("$" + entryPrice);
                      }
                    }}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Target Price</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="$185.00"
                    placeholderTextColor="#777"
                    value={targetPrice}
                    onChangeText={(text) =>
                      formatPriceInput(text, setTargetPrice)
                    }
                    keyboardType="numbers-and-punctuation"
                    onBlur={() => {
                      // Ensure $ is added when field loses focus
                      if (targetPrice && !targetPrice.startsWith("$")) {
                        setTargetPrice("$" + targetPrice);
                      }
                    }}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Stop Loss</Text>
                <TextInput
                  style={styles.input}
                  placeholder="$170.00"
                  placeholderTextColor="#777"
                  value={stopLoss}
                  onChangeText={(text) => formatPriceInput(text, setStopLoss)}
                  keyboardType="numbers-and-punctuation"
                  onBlur={() => {
                    // Ensure $ is added when field loses focus
                    if (stopLoss && !stopLoss.startsWith("$")) {
                      setStopLoss("$" + stopLoss);
                    }
                  }}
                />
              </View>
            </>
          )}

          {/* Content/Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {type === "formula"
                ? "Formula"
                : type === "note"
                ? "Notes"
                : "Additional Details"}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={
                type === "formula"
                  ? "Enter your trading formula..."
                  : type === "long" || type === "short"
                  ? "Enter analysis, strategy, or additional notes..."
                  : "Enter your notes..."
              }
              placeholderTextColor="#777"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <NavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  keyboardAvoid: {
    flex: 1,
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
  form: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 12,
    color: "#FFF",
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: "48%",
    alignItems: "center",
  },
  selectedTypeButton: {
    borderWidth: 2,
    borderColor: "#FFF",
  },
  typeButtonText: {
    color: "#FFF",
    fontWeight: "500",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AddNoteScreen;
