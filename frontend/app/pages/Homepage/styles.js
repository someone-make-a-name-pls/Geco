import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: "flex",
      alignItems: "stretch",
    },
    scrollContainer: {
      backgroundColor: 'white',
      padding: 10,
    },
    titleStyle: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    sectionHeader: {
      fontWeight: "bold",
      marginLeft: 10,
      borderBottomWidth: 1,
      borderBottomColor: "grey",
      paddingBottom: 5
    },
    titleStyle: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 10,
      overflow: "visible",
    },
    logo: {
      height: 50, width: 100, objectFit: "contain"
    }
  });
