import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Container, Header, Content, List, ListItem, Text } from 'native-base';

export class AddScreen extends Component {
  render() {
    return (
        <Content>
          <List>
            <ListItem>
              <Text>Add 1</Text>
            </ListItem>
            <ListItem>
              <Text>Add 2</Text>
            </ListItem>
            <ListItem>
              <Text>Add 3</Text>
            </ListItem>
            <ListItem>
              <Text>Add 4</Text>
            </ListItem>
          </List>
        </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
