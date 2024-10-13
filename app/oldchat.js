import { Image } from "expo-image";
import {
  StyleSheet,
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
import { Ionicons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

export default function home() {
  const [getchatArray, setChatArray] = useState([]);
  const [getSearchText, setSearchText] = useState("");

  const [loggedInUser, setLoggedInUser] = useState(null);

  const defaultDP = require("../assets/images/defaultDP.png");

  const [loaded, error] = useFonts({
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  // Helper function to convert 12-hour time to minutes since midnight
  function convertToMinutes(time) {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours < 12) {
      hours += 12; // Convert PM hours
    } else if (modifier === "AM" && hours === 12) {
      hours = 0; // Convert midnight hour
    }

    return hours * 60 + minutes; // Total minutes since midnight
  }

  useEffect(() => {
    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      setLoggedInUser(user);

      let response = await fetch(
        process.env.EXPO_PUBLIC_URL + "/Trivio/LoadHomeData?id=" + user.id
      );

      if (response.ok) {
        let json = await response.json();

        if (json.success) {
          let chatArray = json.jsonChatArray;

          let chatHistoryArray = chatArray
            .filter((item) => item.message !== "Say Hi! From Trivio.")
            .sort((a, b) => convertToMinutes(b.datetime) - convertToMinutes(a.datetime)); // Sort from latest to earliest

          // chatArray.forEach((item) => {
          //   console.log(item.datetime); // Check the datetime format
          // });
          setChatArray(chatHistoryArray);
        }
      }
    }

    fetchData();

    setInterval(() => {
      fetchData();
    }, 5000);
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Search functionality

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
          <View style={styles.searchInput}>
            <TextInput
              style={styles.searchInputText}
              placeholder="Search"
              value={getSearchText}
              onChangeText={(text) => {
                setSearchText(text);
              }}
              autoCorrect={false}
              spellCheck={false}
              placeholderTextColor="#939393"
            />
          </View>
          <View style={styles.searchIcon}>
            <FontAwesome6
              name="pen-to-square"
              style={styles.searchIconView}
              size={35}
              color="#939393"
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
                  //Alert.alert("View Chat", "User:" + item.other_user_id);
                  router.replace({
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
                      "/Trivio/userDPImages/" +
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
                    item.other_user_status === 1
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
                      {loggedInUser &&
                      item.message_sender_id == loggedInUser.id ? (
                        <Ionicons
                          name={
                            item.chat_status_id == 1
                              ? "checkmark-done-outline"
                              : "checkmark-outline"
                          }
                          size={20}
                          color={item.chat_status_id == 1 ? "green" : "gray"}
                        />
                      ) : // <Ionicons name="checkmark-done" size={18} color={"black"} />
                      null}
                      <Text style={styles.chatContext} numberOfLines={1}>
                        {item.message}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.chatView2}>
                    <Text style={styles.chatTime}>
                      {item.datetime}
                    </Text>
                    <View
                      style={item.unseen_count == 0 ? null : styles.msgCount}
                    >
                      <Text style={styles.msgCountText} numberOfLines={1}>
                        {item.unseen_count}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
            estimatedItemSize={200}
          />
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Pressable
            style={styles.addFriendButton}
            onPress={() => router.push("/addFriend")}
          >
            <FontAwesome6 name="plus" size={20} color="white" />
          </Pressable>
          <View style={styles.chatIconsBody}>
            <View style={styles.chatIconleft}>
              <Text>
                <FontAwesome6 name="phone" size={25} color="gray" />
              </Text>
              <Text>
                <FontAwesome6 name="comments" size={25} color="#703eff" />
              </Text>
            </View>
            <View style={styles.chatIconRight}>
              <Text>
                <FontAwesome6 name="video" size={25} color="gray" />
              </Text>
              <Pressable
                onPress={async () => {
                  try {
                    await AsyncStorage.removeItem("user");
                    router.replace("/");
                  } catch (error) {
                    Alert.alert("Logout Error: " + error);
                  }
                }}
              >
                <FontAwesome6
                  name="right-from-bracket"
                  size={25}
                  color="gray"
                />
              </Pressable>
            </View>
          </View>
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
    columnGap: 20,
    alignItems: "center",
    paddingVertical: 10,
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
