// import { StatusBar } from 'expo-status-bar';

import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function App() {

  const backgroundImage = require("../assets/images/backgroundImg.jpg");
  const frontImage = require("../assets/images/frontImg.png");
  const startImage = require("../assets/images/startImg.png");
  const logoPath = require("../assets/images/logo.png");

  const [loaded, error] = useFonts({
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  useEffect(
    () => {
      async function checkUser() {
        try {
          let userJson = await AsyncStorage.getItem("user");
          //console.log(userJson)
          if (userJson != null) {
            router.replace("/home");
          }
        } catch (error) {
          console.log(error);
        }
      }
      checkUser();
    }, []
  );

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
        <View style={styles.view1}>
          <Image
            source={startImage}
            style={styles.startImage}
            contentFit={"contain"}
          />
        </View>

        <View style={styles.view2}>
          <View>
            <View style={styles.viewrow1}>
              <Text style={styles.headertexts}>
                Chat effortlessly and stay connected with Trivio.
              </Text>
              <Text style={styles.pharagraphs}>
                Share your thoughts with friends freely.
              </Text>
            </View>

            {/* getstartbutton */}
            <View style={styles.viewrow2}>
              <View>
              <Pressable
                style={({ pressed }) => [
                  styles.getStartButton,
                  pressed ? styles.pressedButton : styles.defaultButton,
                ]}

                onPress={() => {
                  router.replace("/signIn");
                }}
              >
                <Text style={styles.getStartButtontexts}>Get Started</Text>
              </Pressable>
              </View>
            </View>

            <View style={styles.viewrow3}>
              <Text style={styles.powerdby}>Powerd by</Text>
              <Image
                source={logoPath}
                style={styles.logoImage}
                contentFit={"contain"}
              />
              <Text style={styles.trivioText}>Trivio</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#703eff",
    flex: 1,
  },

  view1: {
    flex: 2,
  },

  view2: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 50,
    borderColor: "white",
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  headertexts: {
    fontSize: 25,
    fontFamily: "Roboto-Bold",
    color: "black",
    textAlign: "center",
  },

  subtexts: {
    fontSize: 20,
    fontFamily: "Roboto-Medium",
    marginBottom: 10,
  },

  pharagraphs: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#737874",
    marginTop: 15,
  },

  frontImage: {
    width: "80%",
    height: "100%",
    alignSelf: "center",
  },

  startImage: {
    width: "70%",
    height: "100%",
    alignSelf: "center",
  },

  viewrow1: {
    alignItems: "center",
    justifyContent: "center",
  },

  viewrow2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  viewrow3: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  getStartButton: {
    backgroundColor: "#703eff",
    width: 300,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
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

  powerdby: {
    // marginTop: 45,
    marginEnd: 10,
    fontFamily: "Roboto-Regular",
    color: "#737874",
    fontWeight: "bold",
  },

  trivioText: {
    fontSize: 20,
    // marginTop: 40,
    fontFamily: "Roboto-Regular",
    color: "#703eff",
    fontWeight: "bold",
    marginStart: 5,
  },

  logoImage: {
    width: 25,
    height: 25,
    // marginTop: 45,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
