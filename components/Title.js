import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Title(props) {
    
  return (
    <Text style={styles.title}>{props.titleText}</Text>
  );
}

const styles = StyleSheet.create({
    title: {
        paddingTop: 20,
        color: "blue"
    }
});
