import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
//import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useEffect, useState, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function chat() {
  const defaultDP = require("../assets/images/defaultDP.svg");

  //get parameters
  const item = useLocalSearchParams();

  // store chat array
  const [getchatArray, setChatArray] = useState([]);
  const [getChatText, setChatText] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);

  const userImg = require("../assets/images/chamika.jpeg");

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

  useEffect(() => {
    async function fetchChatArray() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      let response = await fetch(
        process.env.EXPO_PUBLIC_URL +
          "/Trivio-Back-End/LoadChat?logged_user_id=" +
          user.id +
          "&other_user_id=" +
          item.other_user_id +
          "&initialLoad=" +
          initialLoad
      );
      if (response.ok) {
        let chatArray = await response.json();
        // Set the chat array
        setChatArray(chatArray);
      }
    }

    fetchChatArray();

    const interval = setInterval(() => {
      setInitialLoad(false);
      fetchChatArray();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* main view */}
      <View style={styles.mainView}>
        {/* header */}
        <View style={styles.header}>
          <View style={styles.userBasics}>
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

            {item.profile_dp_found == "true" ? (
              <Image
                style={styles.userImg}
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
                style={styles.userImg}
                contentFit={"cover"}
              />
            )}
          </View>

          <Pressable
            style={styles.headerTextContainer}
            onPress={async () => {
              router.push({ pathname: "/profile", params: item });
            }}
          >
            <Text style={styles.chatName} numberOfLines={1}>
              {item.other_user_name}
            </Text>
            <Text
              style={
                item.other_user_status == 1
                  ? styles.chtStatus
                  : styles.chtStatusOffline
              }
            >
              {item.other_user_status == 1 ? "Online" : "Offline"}
            </Text>
          </Pressable>

          <View style={styles.headerBtns}>
            <Pressable style={styles.backBtn}>
              <FontAwesome6 name="video" size={25} color="#939393" />
            </Pressable>
            <Pressable style={styles.backBtn}>
              <FontAwesome6 name="phone" size={25} color="#939393" />
            </Pressable>
          </View>
        </View>

        {/* chat context box */}
        <View style={styles.chatScrollView}>
          <FlashList
            data={getchatArray}
            showsVerticalScrollIndicator={false}
            inverted={false}
            renderItem={({ item, index }) => {
              const previousItem = getchatArray[index - 1];
              const showDate = !previousItem || previousItem.date !== item.date; // Show date if it's the first message of the day
              //console.log(item.date);
              return (
                <View>
                  <View style={styles.msgDayView}>
                    {/* Show date for conversation start and on day change */}
                    {index === 0 ? (
                      <Text style={styles.msgDay}>{item.date}</Text>
                    ) : showDate ? (
                      <Text style={styles.msgDay}>{item.date}</Text>
                    ) : null}
                  </View>
                  <View style={styles.chatContextBox}>
                    <View>
                      {/* Chat bubble */}
                      <View
                        style={
                          item.side == "right"
                            ? styles.rightchatBox
                            : styles.leftchatBox
                        }
                      >
                        <Text>{item.message}</Text>
                      </View>

                      {/* Timestamp */}
                      <View
                        style={
                          item.side == "right"
                            ? styles.rightMsgTime
                            : styles.leftMsgTime
                        }
                      >
                        <Text style={styles.msgTimeText}>{item.time}</Text>
                        {item.side == "right" ? (
                          <Ionicons
                            name={
                              item.status == 1
                                ? "checkmark-done-outline"
                                : "checkmark-outline"
                            }
                            size={15}
                            color={item.status == 1 ? "green" : "gray"}
                          />
                        ) : null}
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
            estimatedItemSize={200}
          />
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <View style={styles.msgSendingView}>
            <View style={styles.msgInputView}>
              <TextInput
                style={styles.msgInputText}
                placeholder="Message..."
                placeholderTextColor="#939393"
                value={getChatText}
                multiline={true}
                editable={true}
                selectTextOnFocus={true}
                onChangeText={(text) => {
                  setChatText(text);
                }}
              />
              <Pressable style={styles.attachImageBtn}>
                <FontAwesome6 name="image" size={30} color="#703eff" />
              </Pressable>
            </View>

            <View style={styles.sendBtnView}>
              <Pressable
                style={styles.sendBtn}
                onPress={async () => {
                  if (getChatText.length == 0) {
                    Alert.alert("Error", "Please enter a message");
                  } else {
                    let userJson = await AsyncStorage.getItem("user");
                    let user = JSON.parse(userJson);

                    let response = await fetch(
                      process.env.EXPO_PUBLIC_URL +
                        "/Trivio-Back-End/SendChat?logged_user_id=" +
                        user.id +
                        "&other_user_id=" +
                        item.other_user_id +
                        "&message=" +
                        getChatText
                    );
                    if (response.ok) {
                      let json = await response.json();

                      if (json.success) {
                        console.log("Message sent");
                        setChatText("");
                      }
                    }
                  }
                }}
              >
                <Ionicons name="send-outline" size={20} color="white" />
              </Pressable>
            </View>
            {/* <TextInput
              style={styles.searchInputText}
              placeholder="Message..."
              placeholderTextColor="#939393"
              value={getChatText}
              multiline={true}
              editable={true}
              selectTextOnFocus={true}
              onChangeText={(text) => {
                setChatText(text);
              }}
            /> */}
            {/* <Pressable
              style={styles.sendBtn}
              onPress={async () => {
                if (getChatText.length == 0) {
                  Alert.alert("Error", "Please enter a message");
                } else {
                  let userJson = await AsyncStorage.getItem("user");
                  let user = JSON.parse(userJson);

                  let response = await fetch(
                    process.env.EXPO_PUBLIC_URL +
                      "/Trivio/SendChat?logged_user_id=" +
                      user.id +
                      "&other_user_id=" +
                      item.other_user_id +
                      "&message=" +
                      getChatText
                  );
                  if (response.ok) {
                    let json = await response.json();

                    if (json.success) {
                      console.log("Message sent");
                      setChatText("");
                    }
                  }
                }
              }}
            >
              <FontAwesome6 name="paper-plane" size={20} color="#703eff" />
            </Pressable> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    flex: 1,
  },

  mainView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },

  //Header
  header: {
    flexDirection: "row",
    columnGap: 5,
    width: "100%",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },

  userBasics: {
    flexDirection: "row",
    columnGap: 15,
    alignItems: "center",
  },

  userImg: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },

  headerTextContainer: {
    flex: 2,
    width: "100%",
  },

  chatName: {
    fontFamily: "Roboto-Medium",
    fontSize: 18,
  },

  chtStatus: {
    fontFamily: "Roboto-Regular",
    fontSize: 15,
    color: "green",
  },

  chtStatusOffline: {
    fontFamily: "Roboto-Regular",
    fontSize: 15,
    color: "gray",
  },

  headerBtns: {
    flex: 1,
    flexDirection: "row",
    columnGap: 30,
    justifyContent: "flex-end",
  },

  //Chatbody - scroll view
  chatScrollView: {
    flex: 1,
    width: "90%",
  },

  chatContextBox: {
    paddingVertical: 10,
  },

  msgDayView: {
    margingVertical: 100,
    marginHorizontal: 15,
    marginTop: 15,
  },

  msgDay: {
    alignSelf: "center",
    color: "gray",
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: "Roboto-Regular",
    fontSize: 12,
  },

  leftchatBox: {
    width: "auto",
    maxWidth: "80%",
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },

  leftMsgTime: {
    alignSelf: "flex-start",
    marginHorizontal: 15,
    color: "gray",
    marginTop: 5,
  },

  rightchatBox: {
    flex: 1,
    width: "auto",
    maxWidth: "80%",
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },

  rightMsgTime: {
    alignSelf: "flex-end",
    marginHorizontal: 15,
    marginTop: 5,
    color: "gray",
    flexDirection: "row",
  },

  msgTimeText: {
    fontFamily: "Roboto-Regular",
    color: "gray",
    marginRight: 5,
  },

  //footer

  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },

  msgSendingView: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    //backgroundColor: "#edecec",
    alignItems: "center",
    columnGap: 10,
  },

  msgInputView: {
    flexDirection: "row",
    paddingVertical: 5,
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#edecec",
    alignItems: "center",
    width: "85%",
  },

  msgInputText: {
    width: "80%",
    height: "100%",
    borderRightWidth: 1,
    borderColor: "gray",
    //backgroundColor: "yellow",
    paddingHorizontal: 10,
  },

  attachImageBtn: {
    width: "20%",
    //backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },

  sendBtnView: {
    width: "14%",
    borderRadius: 100,
    backgroundColor: "#703eff",
    justifyContent: "center",
    alignItems: "center",
  },

  sendBtn: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  // searchInputText: {
  //   width: "80%",
  //   height: "100%",
  //   paddingHorizontal: 15,
  //   fontFamily: "Roboto-Regular",
  //   fontSize: 15,
  //   borderRightWidth: 1,
  //   borderColor: "gray",
  // },

  // sendBtn: {
  //   flex: 1,
  //   rowGap: 10,
  //   alignItems: "center",
  // },
});
