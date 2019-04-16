import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ModuleCard = (props) => {
    return (
        <View style={ styles.container }>
          <Text style={ styles.title }>{props.title}</Text>
          <Text style={ styles.text }>{props.result}</Text>
          <Text style={ styles.text }>confidence: {props.confidence}</Text>
          <Text style={ styles.text }>process ms: {props.processTime}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        //    flexDirection: 'col',
        backgroundColor: '#000000aa',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        //alignSelf: 'stretch',
        //width: '80%',
        margin: 5,
        padding: 5
    },
    title: {
        color: '#09a55f',
        fontWeight: 'bold',
        fontSize: 20
    },
    text: {
        color: '#fff',
        fontWeight: 'normal',
        fontSize: 14
    }
});

export default ModuleCard;
