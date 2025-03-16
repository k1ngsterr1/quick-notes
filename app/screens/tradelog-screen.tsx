import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Modal animationType="slide" transparent={true}>
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.navigate("MainScreen" as never)}
            >
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.lastUpdated}>Last updated: {currentDate}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. General Provisions</Text>
              <Text style={styles.sectionText}>
                BearBull Notes (hereinafter referred to as the "Application")
                respects your privacy and places great importance on protecting
                your personal data. This Privacy Policy describes what data we
                collect, how we use it, and what measures we take to protect it.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Data We Collect</Text>
              <Text style={styles.sectionText}>
                When using the Application, the following data may be collected:
              </Text>
              <Text style={styles.bulletPoint}>
                • <Text style={styles.boldText}>Personal Data</Text>: Username,
                email (if registration is required);
              </Text>
              <Text style={styles.bulletPoint}>
                • <Text style={styles.boldText}>User-Generated Content</Text>:
                Trading notes, note categories, activity statistics;
              </Text>
              <Text style={styles.bulletPoint}>
                • <Text style={styles.boldText}>Technical Data</Text>: Device
                information, IP address, operating system, application version;
              </Text>
              <Text style={styles.bulletPoint}>
                •{" "}
                <Text style={styles.boldText}>
                  Cookies and Similar Technologies
                </Text>
                : Used to enhance application performance and analyze user
                activity.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. How We Use Data</Text>
              <Text style={styles.sectionText}>
                The collected data may be used for the following purposes:
              </Text>
              <Text style={styles.bulletPoint}>
                • Providing access to the Application's functionality;
              </Text>
              <Text style={styles.bulletPoint}>
                • Analyzing user activity to improve the service;
              </Text>
              <Text style={styles.bulletPoint}>
                • Support and bug fixes in the Application;
              </Text>
              <Text style={styles.bulletPoint}>
                • Protection against unauthorized access and fraud.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                4. Sharing Data with Third Parties
              </Text>
              <Text style={styles.sectionText}>
                We do not share your personal data with third parties except in
                the following cases:
              </Text>
              <Text style={styles.bulletPoint}>
                • If required by law (e.g., by request from government
                authorities);
              </Text>
              <Text style={styles.bulletPoint}>
                • If integrated with analytics services (e.g., Google Analytics)
                in compliance with their privacy policies.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Data Security</Text>
              <Text style={styles.sectionText}>
                We take all reasonable measures to protect your data, including
                encryption, server protection, and restricted access to
                information.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Data Retention</Text>
              <Text style={styles.sectionText}>
                Your data is stored for as long as necessary to fulfill the
                purposes outlined in this Policy. You can request the deletion
                of your data by contacting customer support.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. User Rights</Text>
              <Text style={styles.sectionText}>You have the right to:</Text>
              <Text style={styles.bulletPoint}>
                • Request access to your data;
              </Text>
              <Text style={styles.bulletPoint}>
                • Request correction or deletion of your data;
              </Text>
              <Text style={styles.bulletPoint}>
                • Opt out of data processing for marketing purposes;
              </Text>
              <Text style={styles.bulletPoint}>
                • Transfer your data if needed.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                8. Changes to the Privacy Policy
              </Text>
              <Text style={styles.sectionText}>
                We may update this Privacy Policy periodically. Users will be
                notified of any changes via the Application or other available
                means.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Contact Information</Text>
              <Text style={styles.sectionText}>
                If you have any questions regarding this Policy, please contact
                us at: support@traderjournal.app
              </Text>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => navigation.navigate("MainScreen" as never)}
              >
                <Text style={styles.acceptButtonText}>I Understand</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    flex: 1,
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: height * 0.05,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF9800",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: "#FFF",
    lineHeight: 24,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#FFF",
    lineHeight: 24,
    marginLeft: 10,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "80%",
  },
  acceptButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PrivacyPolicyScreen;
