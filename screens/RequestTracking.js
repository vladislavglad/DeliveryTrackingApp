import React from 'react';
import { StyleSheet, Text, View, Button, Alert, ScrollView, TextInput } from 'react-native';
//import { TextInput } from 'react-native-gesture-handler'; // What's the difference with React's own?

export default function RequestTracking( {navigation} ) {
    
    const [getUserName, setUserName] = React.useState("");
    const [getEmail, setEmail] = React.useState("");
    const [getTrackingNum, setTrackingNum] = React.useState("");

    return (
        <ScrollView>
        <View style={styles.container}>
        
            {/* TODO: Make these into a separate component */}
            <View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Your Name</Text>            
                </View>
                <TextInput style={styles.textInput}
                    placeholder="John Doe"
                    value = {getUserName}
                    onChangeText = {name => setUserName(name)}
                />
            </View>
            <View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Email Address</Text>            
                </View>
                <TextInput style={styles.textInput}
                    placeholder="johndoe@mail.com"
                    value = {getEmail}
                    onChangeText = {email => setEmail(email)}
                />
            </View>
            <View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Tracking Number</Text>            
                </View>
                <TextInput style={styles.textInput}
                    placeholder="9400 1000 0000 0000 0000 00"
                    value = {getTrackingNum}
                    onChangeText = {num => setTrackingNum(num)}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button 
                    onPress={() => {
                        console.log(`user: ${getUserName}, email: ${getEmail}, num: ${getTrackingNum}`);
                        Alert.alert("Message:", "Your request has been submited!"); 
                    }}
                    title = "Submit"
                />
            </View>
        </View>
        </ScrollView>
  );

}

const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      justifyContent: "center"
    },
    buttonContainer: {
        marginTop: 35,
        flexDirection: "column",
        margin: 15,
    },
    textContainer: {
        flexDirection: "row",
        margin: 20,
        justifyContent: "center"
    },
    text: {
      fontSize: 18,
      marginTop: 20,
      textAlign: "center"
    },
    textInput: {
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1, 
        textAlign: "center"
    }
  });