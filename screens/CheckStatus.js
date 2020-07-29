import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';

// Custom componenets.
import Title from "../components/Title"

const API = "http://localhost:3000/lookup/:trackingNum";

export default function CheckStatus( {navigation} ) {

    const [text, onChangeText] = React.useState("");

    const processRequest = async (trackingNum) => {
        console.log("Provided tracking num: " + trackingNum);
    
        const res = await fetch(API.replace(":trackingNum", trackingNum));
        const data = await res.json();
    
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
      
        <View>
            <Text>Please provide your credentials!</Text>
        </View>
    
        <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => onChangeText(text)}
        value={text}
        placeholder="Your Tracking Number"
        />

        <Button
        onPress={async () => await processRequest(text)}
        title="Submit"
        color="#841584"
        />

    </View>
  );

}
