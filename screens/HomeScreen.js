import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

// Custom componenets.
import Title from "../components/Title"

export default function HomeScreen( {navigation} ) {

  return (
    <View>
        <Title 
            titleText = "About this app"
        />

        <Text>Text from navigation: {navigation.title}</Text>

        <Button 
            onPress={ () => {
                navigation.navigate("requestScreen", {msg: "Passing msg to request Delivery!"});
            }}
            title = "To Request"
        />
        <Button 
            onPress={ () => {
                navigation.navigate("checkScreen", {msg: "Passing msg to check Delivery!"});
            }}
            title = "To Check"
        />

      <StatusBar style="auto" />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
