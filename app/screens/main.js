import React, { Component } from 'react';
import { Platform, StyleSheet, StatusBar } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Button } from 'native-base';

// window.navigator.userAgent = "react-native";
import io from 'socket.io-client';

export class MainScreen extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    // Creating the socket-client instance will automatically connect to the server.
    // Query parameters can also be provided, either with the query option
    // or directly in the url (example: http://localhost/users?token=abc)
    this.socket = io('https://api.herce.co/live');

    this.socket.on('connect', () => {
      var room = '1234';
      // Connected, let's sign-up for to receive messages for this room
      this.socket.emit('room', {room: room}, function (answer) { console.log(answer); });
    });
  }

  sendPress = () => {
    this.socket.emit('chat', {room: '1234', sender: 'alex', message: 'Testing from Native'}, function (answer) { console.log(answer); });
  }

  render() {
    return (
      <Content>
        <List>
          <ListItem>
            <Text>Simon Mignolet</Text>
          </ListItem>
          <ListItem>
            <Text>Nathaniel Clyne</Text>
          </ListItem>
          <ListItem>
            <Text>Dejan Lovren</Text>
          </ListItem>
          <ListItem>
            <Button onPress={this.sendPress}>
              <Text>Click Me! </Text>
            </Button>
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
