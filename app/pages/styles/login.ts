import {
    StyleSheet,
} from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
    },
    gradientBackground: {
      ...StyleSheet.absoluteFillObject,
    },
    backgroundImage: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.7,
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#ccc',
      marginBottom: 30,
      textAlign: 'center',
    },
    input: {
      width: '100%',
      height: 50,
      borderRadius: 10,
      borderColor: '#fff',
      borderWidth: 1,
      paddingHorizontal: 15,
      marginVertical: 10,
      color: '#fff',
      fontSize: 16,
    },
    loginButton: {
      marginTop: 20,
      backgroundColor: '#000000',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 25,
      width: '80%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 10,
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
    },
    forgotPassword: {
      marginTop: 15,
      fontSize: 14,
      color: '#fff',
      textDecorationLine: 'underline',
    },
  });
  