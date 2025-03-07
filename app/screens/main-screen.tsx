import { NavigationBar } from "@/components/ui/navigation-bar/navigation-bar";
import { SafeAreaLayout } from "@/components/ui/safe-area-layout/safe-area-layout";
import { Home, Plus, Search, Settings2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  Settings,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialNotes = [
  {
    id: "1",
    title: "Shopping List",
    content: "Milk, Eggs, Bread, Apples",
    date: "2 hours ago",
  },
  {
    id: "2",
    title: "Meeting Notes",
    content: "Discuss project timeline and resource allocation",
    date: "Yesterday",
  },
  {
    id: "3",
    title: "Ideas",
    content: "App feature: dark mode toggle, cloud sync",
    date: "3 days ago",
  },
  {
    id: "4",
    title: "Books to Read",
    content: "Atomic Habits, Deep Work, The Psychology of Money",
    date: "Last week",
  },
  {
    id: "5",
    title: "Workout Plan",
    content: "Monday: Chest, Tuesday: Back, Wednesday: Legs",
    date: "Last week",
  },
];

const MainScreen = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QuickNotes</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#FFF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
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

      {/* Notes list */}
      <ScrollView
        style={styles.notesContainer}
        contentContainerStyle={styles.notesContent}
      >
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <TouchableOpacity key={note.id} style={styles.noteCard}>
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text style={styles.noteContent} numberOfLines={2}>
                {note.content}
              </Text>
              <Text style={styles.noteDate}>{note.date}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notes found</Text>
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
  notesContainer: {
    flex: 1,
  },
  notesContent: {
    padding: 16,
    paddingBottom: 80,
  },
  noteCard: {
    backgroundColor: "#FFC107",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: "#555",
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
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    paddingVertical: 12,
    paddingHorizontal: 30,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  activeNavItem: {
    borderRadius: 8,
  },
  navText: {
    color: "#FFF",
    fontSize: 12,
    marginTop: 4,
  },
  activeNavText: {
    color: "#FF9800",
  },
});

export default MainScreen;
