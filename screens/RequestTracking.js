import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler'; // What's the difference with React's own?


// Custom componenets.
import Title from "../components/Title"

export default function RequestTracking( {navigation} ) {
    
    const [getUserName, setUserName] = React.useState("");
    const [getEmail, setEmail] = React.useState("");
    const [getTrackingNum, setTrackingNum] = React.useState("");

    return (
        <View>
        
            <Title 
                titleText = "Request Delivery Status"
            />

            {/* Make this into a separate component */}
            <Text>Your Username</Text>
            <TextInput/>

            <Text>Email</Text>
            <TextInput/>

            <Text>Tracking Number</Text>
            <TextInput
                placeholder="123456789"
                value = {getTrackingNum}
                onChange = {(input) => {setTrackingNum(input)}}
            />

            <Button 
                onPress={() => {
                    console.log("Subbmited!");
                }}
                title = "Submit"
            />

        </View>
  );
}
