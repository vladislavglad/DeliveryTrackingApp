import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';

const API = "http://localhost:3000/lookup/:trackingNum";

export default function CheckStatus( {navigation} ) {

  const [text, onChangeText] = React.useState("");

  const processRequest = async (trackingNum) => {
    console.log("Provided tracking num: " + trackingNum);

    const res = await fetch(API.replace(":trackingNum", trackingNum));
    const data = await res.json();
    //console.log(data);

    if (data.trackingNum) {
      if (data.isDelivered)
        Alert.alert("Message:", "Your package has been delivered!");
      else 
        Alert.alert("Message:", "Your package has not been delivered!");
    } else
      Alert.alert("Message:", "Invalid Tracking Number!");

  }

  return (
    <View>
      <View style={styles.textContainer}>
        <Text styel={styles.text}>Please provide your tracking number!</Text>
      </View>
      <TextInput
        style={styles.textInput}
        onChangeText={text => onChangeText(text)}
        value={text}
        placeholder="Your Tracking Number"
      />
      <View style={styles.buttonContainer}>
        <Button
          onPress={async () => await processRequest(text)}
          title="Submit"
        />
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: "row",
    margin: 20,
    justifyContent: "center"
  },
  buttonContainer: {
    margin: 20
  },
  textInput: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    textAlign: "center"
  },
  text: {
    textAlign: "center"
  }
});