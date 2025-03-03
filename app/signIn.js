// import React from 'react';
// import { View, Text, StyleSheet, Pressable } from 'react-native';

// export default function App() {
//   const sendCommand = async (command) => {
//     try {
//       const response = await fetch('http://192.168.43.11:8080/remote-control-car/CommandServlet', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: `command=${command}`,
//       });
//       console.log(`Command sent: ${command}`);
//     } catch (error) {
//       console.error(`Error sending ${command}:`, error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Pressable
//         style={styles.button}
//         onPressIn={() => sendCommand('FORWARD')} // Command starts when pressed
//         onPressOut={() => sendCommand('STOP')}  // Command stops when released
//       >
//         <Text style={styles.buttonText}>Forward</Text>
//       </Pressable>

//       <Pressable
//         style={styles.button}
//         onPressIn={() => sendCommand('BACKWARD')}
//         onPressOut={() => sendCommand('STOP')}
//       >
//         <Text style={styles.buttonText}>Backward</Text>
//       </Pressable>

//       <Pressable
//         style={styles.button}
//         onPressIn={() => sendCommand('TURN_LEFT')} // Start turning left
//         onPressOut={() => sendCommand('FORWARD')}  // Continue moving forward after releasing
//       >
//         <Text style={styles.buttonText}>Left</Text>
//       </Pressable>

//       <Pressable
//         style={styles.button}
//         onPressIn={() => sendCommand('TURN_RIGHT')} // Start turning right
//         onPressOut={() => sendCommand('FORWARD')}  // Continue moving forward after releasing
//       >
//         <Text style={styles.buttonText}>Right</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f2f2f2',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 5,
//     margin: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
