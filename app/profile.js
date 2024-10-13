import { Image, ImageBackground } from "expo-image";
import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

export default function Profile() {
  //get parameters
  const item = useLocalSearchParams();

  const backgroundImage = require("../assets/images/backgroundImg.jpg");
  const defaultDP = require("../assets/images/defaultDP.svg");

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
    <SafeAreaView>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.header}>
          <FontAwesome6
            name="arrow-left"
            size={20}
            color="#939393"
            onPress={() => {
              router.back();
            }}
          />
          <Text style={styles.headerText}>Profile</Text>
        </View>

        <View style={styles.mainView}>
          {item.profile_dp_found == "true" ? (
            <Image
              style={styles.profilePic}
              contentFit={"cover"}
              source={
                process.env.EXPO_PUBLIC_URL +
                "/Trivio-Back-End/userDPImages/" +
                item.other_user_mobile +
                ".png"
              }
            />
          ) : (
            <Image
              source={defaultDP}
              style={styles.profilePic}
              contentFit={"cover"}
            />
          )}
          <View style={styles.userDetailsView}>
            <View style={styles.textHeaderView}>
              <FontAwesome6 name="user-large" size={23} color="#703eff" />
              <Text style={styles.textHeader}>Name</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userDataText}>{item.other_user_name}</Text>
            </View>

            <View style={styles.textHeaderView}>
              <FontAwesome6 name="mobile" size={25} color="#703eff" />
              <Text style={styles.textHeader}>Mobile</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userDataText}>{item.other_user_mobile}</Text>
            </View>

            <View style={styles.textHeaderView}>
              <Ionicons name="calendar" size={25} color="#703eff" />
              <Text style={styles.textHeader}>Registered Date</Text>
            </View>

            <View style={styles.userDetails}>
              <Text style={styles.userDataText}>
                {item.other_user_registerd_date}
              </Text>
            </View>
          </View>
        </View>

        {
          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.getStartButton,
                pressed ? styles.pressedButton : styles.defaultButton,
              ]}
            >
              {item.message == "Say Hi! From Trivio." ? (
                <Pressable
                  style={styles.newFriendButton}
                  onPress={() => {
                    //Alert.alert("View Chat", "User:" + item.other_user_id);
                    router.replace({
                      pathname: "/chat",
                      params: item,
                    });
                  }}
                >
                  <Text style={styles.getStartButtontexts}>Say Hi!</Text>
                  <FontAwesome6
                    name="hand"
                    size={20}
                    color="white"
                    style={styles.helloIcon}
                  />
                </Pressable>
              ) : (
                <Pressable
                  style={styles.newFriendButton}
                  onPress={() => {
                    //Alert.alert("View Chat", "User:" + item.other_user_id);
                    router.replace({
                      pathname: "/chat",
                      params: item,
                    });
                  }}
                >
                  <Text style={styles.getStartButtontexts}>Chat</Text>
                  <FontAwesome6
                    name="comments"
                    size={20}
                    color="white"
                    style={styles.helloIcon}
                  />
                </Pressable>
              )}
            </Pressable>
          </View>
        }
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  header: {
    backgroundColor: "white",
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerText: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    paddingHorizontal: "30%",
  },

  mainView: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 50,
  },

  profilePic: {
    backgroundColor: "blue",
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 60,
  },

  userDetailsView: {
    width: "60%",
  },

  textHeaderView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  textHeader: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  userDetails: {
    backgroundColor: "white",
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 5,
    marginBottom: 25,
    borderColor: "#703eff",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  userDataText: {
    fontSize: 15,
    fontFamily: "Roboto-Bold",
    color: "gray",
  },

  footer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
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

  newFriendButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  helloIcon: {
    marginLeft: 10,
  },
});
