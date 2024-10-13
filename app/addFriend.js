import { Image } from "expo-image";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";

SplashScreen.preventAutoHideAsync();

export default function AddFriend() {
  const [getchatArray, setChatArray] = useState([]);
  const [getSearchText, setSearchText] = useState("");

  const [loggedInUser, setLoggedInUser] = useState(null);

  const defaultDP = require("../assets/images/defaultDP.png");

  const [loaded, error] = useFonts({
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  useEffect(() => {
    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      setLoggedInUser(user); // Store the logged-in user

      let response = await fetch(
        process.env.EXPO_PUBLIC_URL + "/Trivio-Back-End/LoadHomeData?id=" + user.id
      );

      if (response.ok) {
        let json = await response.json();

        if (json.success) {
          let chatArray = json.jsonChatArray;

          // Filter users who haven't any chat
          let noChatArray = chatArray.filter(
            (item) => item.message === "Say Hi! From Trivio."
          );

          setChatArray(noChatArray);
        }
      }
    }

    fetchData();

    // setInterval(() => {
    //   fetchData();
    // }, 3000);
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const filteredChatArray = getchatArray.filter((item) =>
    item.other_user_name.toLowerCase().includes(getSearchText.toLowerCase())
  );

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        {/* header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn}>
            <FontAwesome6
              name="arrow-left"
              size={25}
              color="black"
              onPress={() => {
                router.replace("/home");
              }}
            />
          </Pressable>
          <View style={styles.searchInput}>
            <FontAwesome6
              name="magnifying-glass"
              size={20}
              color="#939393"
              onPress={() => {
                router.push("/home");
              }}
            />

            <TextInput
              style={styles.searchInputText}
              placeholder="Search Your Friends.."
              value={getSearchText} // Controlled input
              onChangeText={(text) => {
                setSearchText(text);
              }} // Call handleSearch on input change
              autoCorrect={false} // Disables autocorrect
              spellCheck={false} // Disables spell checking
              placeholderTextColor="#939393"
            />
          </View>
        </View>

        {/* ChatBody */}
        <View style={styles.scrollview}>
          <FlashList
            data={filteredChatArray} // Use filtered array
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.mgsBox}
                onPress={() => {
                  // Alert.alert("View Chat", "User:" + item.other_user_id);
                  router.push({
                    pathname: "/chat",
                    params: item,
                  });
                }}
              >
                {/* <Image
                  source={userImg}
                  style={styles.userImg}
                  contentFit={"contain"}
                /> */}
                {item.profile_dp_found ? (
                  <Image
                    source={
                      process.env.EXPO_PUBLIC_URL +
                      "/Trivio-Back-End/userDPImages/" +
                      item.other_user_mobile +
                      ".png"
                    }
                    contentFit={"cover"}
                    style={styles.userImg}
                  />
                ) : (
                  <Image
                    source={defaultDP}
                    style={styles.userImg}
                    contentFit={"cover"}
                  />
                )}

                <View
                  style={
                    item.other_user_status == 1
                      ? styles.onlineColor
                      : styles.offlineColor
                  }
                ></View>

                <View style={styles.chatViewBody}>
                  <View style={styles.chatView1}>
                    <Text style={styles.chatName} numberOfLines={1}>
                      {item.other_user_name}
                    </Text>
                    <View style={styles.msg}>
                      {/* Check if the logged-in user sent the message */}
                      {
                        loggedInUser &&
                        item.message_sender_id == loggedInUser.id ? (
                          <FontAwesome6
                            name={
                              item.chat_status_id == 1
                                ? "check-double"
                                : "check"
                            }
                            size={15}
                            color={item.chat_status_id == 1 ? "green" : "gray"}
                          />
                        ) : null /* No check marks for received messages */
                      }
                      <Text style={styles.chatContext} numberOfLines={1}>
                        {item.message}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
            estimatedItemSize={200}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
  },

  mainView: {
    flex: 1,
    width: "100%",
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    width: "90%",
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    paddingVertical: 10,
  },

  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  searchInput: {
    flex: 1,
    flexDirection: "row",
    columnGap: 10,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 5,
    color: "black",
    backgroundColor: "white",
    alignItems: "center",
  },

  searchInputText: {
    width: "88%",
    color: "black",
    fontSize: 15,
  },

  searchIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  // chat

  scrollview: {
    flex: 1,
    width: "90%",
    // backgroundColor: "red",
    alignSelf: "center",
  },

  mgsBox: {
    flexDirection: "row",
    marginVertical: 10,
    columnGap: 20,
    borderRadius: 10,
    backgroundColor: "white",
    paddingVertical: 13,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  userImg: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "white",
  },

  onlineColor: {
    position: "absolute",
    top: 55,
    bottom: 0,
    right: 0,
    left: 50,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#35d43d",
  },

  offlineColor: {
    position: "absolute",
    top: 55,
    bottom: 0,
    right: 0,
    left: 50,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },

  chatViewBody: {
    flex: 1,
    flexDirection: "row",
    columnGap: 10,
  },

  chatView1: {
    flex: 2,
  },

  chatName: {
    fontFamily: "Roboto-Medium",
    fontSize: 18,
  },

  msg: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    width: "90%",
  },

  chatContext: {
    fontFamily: "Roboto-Regular",
    fontSize: 15,
    color: "gray",
  },

  chatView2: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
  },

  chatTime: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    color: "gray",
    marginBottom: 5,
  },

  msgCount: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: "#703eff",
    alignItems: "center",
    justifyContent: "center",
  },

  msgCountText: {
    fontFamily: "Roboto-Medium",
    fontSize: 13,
    color: "white",
    fontWeight: "bold",
  },

  // footer

  footer: {
    flexDirection: "row",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "white",
    width: "100%",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },

  addFriendButton: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#703eff",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: "100",
    bottom: 68,

    shadowColor: "#703eff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1.25,
    shadowRadius: 3.84,
  },

  chatIconsBody: {
    flexDirection: "row",
    width: "85%",
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    // backgroundColor: "red",
  },

  chatIconleft: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-start",
    // backgroundColor: "blue",
    columnGap: 50,
  },

  chatIconRight: {
    flex: 1,
    flexDirection: "row",
    // backgroundColor: "pink",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    columnGap: 50,
  },
});
