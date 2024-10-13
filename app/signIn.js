import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function SignIn() {
  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");

  const backgroundImage = require("../assets/images/backgroundImg.jpg");

  const [loaded, error] = useFonts({
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Create Your Account.</Text>
          <Text style={styles.pharagraphText}>
            To create your Trivio account, please your details.
          </Text>
        </View>

        <ScrollView style={styles.center} showsVerticalScrollIndicator={false}>
          <View style={styles.inputSetOne}>
            <Text style={styles.mobileNumber}>Mobile Number</Text>
            <TextInput
              style={styles.mobileInput}
              placeholder="07XXXXXXXX"
              inputMode="tel"
              onChangeText={(text) => {
                setMobile(text);
              }}
            />
            <Text style={styles.mobileNumber}>Password</Text>
            <TextInput
              style={styles.mobileInput}
              secureTextEntry
              placeholder="********"
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
            <Link href="/signUp" style={styles.goToLogin}>
              Don't have an account? Sign Up.
            </Link>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.getStartButton,
              pressed ? styles.pressedButton : styles.defaultButton,
            ]}
            onPress={async () => {
              let response = await fetch(
                process.env.EXPO_PUBLIC_URL + "/Trivio-Back-End/SignIn", // Correct URL
                {
                  method: "POST", // Ensure it's POST
                  body: JSON.stringify({
                    mobile: getMobile,
                    password: getPassword,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.ok) {
                let json = await response.json();

                if (json.success) {
                  let user = json.user;
                  Alert.alert("Login Successful!", "Hi " + user.name);

                  try {
                    //store user in async storage
                    //console.log(user);
                    await AsyncStorage.setItem("user", JSON.stringify(user));
                    router.replace("/home");
                  } catch (e) {
                    Alert.alert(
                      "Error",
                      "Unable to process yor request. Please try again later."
                    );
                  }
                } else {
                  //problem occured.
                  Alert.alert("Error", json.message);
                }
              }
            }}
          >
            <Text style={styles.getStartButtontexts}>Next</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "yellow",
    //backgroundColor: "#fafafa",
    backgroundColor: "white",
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  header: {
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 25,
    alignItems: "center",
    //backgroundColor: "blue",
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  pharagraphText: {
    fontSize: 15,
    fontWeight: "normal",
    fontFamily: "Roboto-Medium",
    textAlign: "center",
    paddingVertical: 20,
  },

  center: {
    flex: 1,
    width: "auto",
    paddingHorizontal: 20,
    //backgroundColor: "red",
  },

  inputSetOne: {
    width: "60%",
    alignSelf: "center",
  },

  mobileNumber: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
  },

  mobileInput: {
    backgroundColor: "#fafafa",
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    borderColor: "#703eff",
    marginBottom: 10,
  },

  goToLogin: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    color: "#703eff",
  },

  footer: {
    width: "100%",
    //backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },

  getStartButton: {
    backgroundColor: "#703eff",
    width: 300,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  defaultButton: {
    backgroundColor: "#703eff",
  },
  pressedButton: {
    backgroundColor: "#5231cc",
  },

  getStartButtontexts: {
    fontSize: 20,
    fontFamily: "Roboto-Medium",
    color: "white",
    textAlign: "center",
  },
});
