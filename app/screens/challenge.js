import React, { Component } from 'react';
import { Platform, StyleSheet, StatusBar, View, Alert } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Button, Spinner } from 'native-base';
import io from 'socket.io-client';

function handleErrors(response) {
  if (response.status == 401) {
    throw Error('Por favor, vuelve a iniciar sesión');
  }
  return response;
}

function handleResponse(response) {
  if (!response.success) {
    throw Error(response.error);
  }
  return response;
}

export class ChallengeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: this.props.navigation.getParam('accessToken', ''),
      challengeId: this.props.navigation.getParam('id', ''),
      challenge: {},
      loading: false
    }
  }

  static navigationOptions = {
    title: 'Challenge',
  };

  componentDidMount() {
    this.getChallenge();
  }

  getChallenge = () => {
    this.setState({loading: true});

    fetch('https://api.herce.co/v1/challenges/get/' + this.state.challengeId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': this.state.accessToken
      }
    })
    .then(handleErrors)
    .then((response) => response.json())
    .then(handleResponse)
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        loading: false,
        challenge: responseJson.challenge
      });
      this.connectSocket();
    })
    .catch((error) => {
      this.setState({loading: false});
      Alert.alert(
        'Ocurrió un problema',
        error.toString(),
        [{text: 'Aceptar', onPress: () => console.log('OK')}],
        { cancelable: false }
      )
    });
  }

  connectSocket = () => {
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

  Loading = () => {
    return(
      <View>
        <Spinner size="large" color="#00B16A" />
        <Text style={styles.heading3}>Cargando QuickPress...</Text>
      </View>
    );
  }

  Empty = () => {
    return(
      <Text style={styles.heading2}>No se encontró el QuickPress</Text>
    );
  }

  Challenge = () => {
    return(
      <View>
        <Text style={styles.heading2}>{this.state.challenge.name}</Text>
        <Button style={styles.button} onPress={this.sendPress}>
          <Text style={{ textAlign: "center", alignSelf: "center" }}>QuickPress</Text>
        </Button>
      </View>
    );
  }

  InnerContent = () => {
    if (this.state.loading) return <this.Loading/>;
    if(Object.keys(this.state.challenge).length > 0) {
      return <this.Challenge/>;
    } else {
      return <this.Empty/>;
    }
  }

  render() {
    return (
      <Content style={styles.content}>
        <this.InnerContent/>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
    backgroundColor: "white"
  },
  heading: {
    fontSize: 32,
    padding: 10,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heading2: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: "center"
  },
  heading3: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: 'bold',
    alignSelf: "center"
  },
  button: {
    marginTop: 25,
    marginBottom: 5,
    alignSelf: "center",
    backgroundColor: "#000",
  }
});
