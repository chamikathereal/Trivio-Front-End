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
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
// import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function SignUp() {
  const [getImage, setImage] = useState(null);
  const [getMobile, setMobile] = useState("");
  const [getName, setName] = useState("");
  const [getPassword, setPassword] = useState("");

  const backgroundImage = require("../assets/images/backgroundImg.jpg");
  const addDP = require("../assets/images/addDP.svg");

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
          <Pressable
            onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({});

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}
            style={styles.profilePic}
          >
            <Image
              source={getImage ? { uri: getImage } : addDP}
              style={styles.profilePic}
              contentFit={"cover"}
            />
          </Pressable>

          <View style={styles.inputSetOne}>
            <Text style={styles.mobileNumber}>Mobile Number</Text>
            <TextInput
              style={styles.mobileInput}
              inputMode="tel"
              maxLength={10}
              placeholder="07XXXXXXXX"
              onChangeText={(text) => {
                setMobile(text);
              }}
            />
            <Text style={styles.mobileNumber}>Name</Text>
            <TextInput
              style={styles.mobileInput}
              placeholder="Samith Gomes"
              onChangeText={(text) => {
                setName(text);
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
            <Link href="/signIn" style={styles.goToLogin}>
              Already have an account? Log In.
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

              let formData = new FormData();
              formData.append("mobile", getMobile);
              formData.append("userName", getName);
              formData.append("password", getPassword);

              if (getImage != null) {
                formData.append("dpImage", {
                  name: "dp.png",
                  type: "image/png",
                  uri: getImage,
                });
              }

              let response = await fetch(process.env.EXPO_PUBLIC_URL + "/Trivio-Back-End/SignUp", // Correct URL
                {
                  method: "POST", // Ensure it's POST
                  body: formData,
                }
              );

              if (response.ok) {
                let json = await response.json();

                if (json.success) {
                  //user registration complete.
                  Alert.alert("Registration Successful!", json.message);
                  router.replace("/signIn");
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
    backgroundColor: "white",
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  header: {
    width: "100%",
    paddingHorizontal: 25,
    paddingTop: 20,
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

  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 30,
  },

  inputSetOne: {
    width: "80%",
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
