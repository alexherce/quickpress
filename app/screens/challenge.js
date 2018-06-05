import React, { Component } from 'react';
import { Platform, StyleSheet, StatusBar, View, Alert, SafeAreaView } from 'react-native';
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
    this.sendPress = this.sendPress.bind(this);

    this.state = {
      accessToken: this.props.navigation.getParam('accessToken', ''),
      challengeId: this.props.navigation.getParam('id', ''),
      challenge: {},
      loading: false,
      pressed: false
    }
  }

  static navigationOptions = {
    title: 'Challenge',
  };

  componentDidMount() {
    this.getUser();
  }

  getUser = () => {
    this.setState({loading: true});

    fetch('https://api.herce.co/v1/users/me', {
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
      this.setState({
        userId: responseJson.user_id,
        email: responseJson.email,
        name: responseJson.name,
        last_name: responseJson.last_name
      });
      this.getChallenge();
    })
    .catch((error) => {
      this.setState({loading: false});
      Alert.alert(
        'Ocurrió un problema',
        'Ocurrió un problema al verificar tu usuario. Por favor, inicia sesión nuevamente. ' + error.toString(),
        [{text: 'Aceptar', onPress: () => {
          AsyncStorage.removeItem('accessToken')
          .then(() => this.props.navigation.navigate('AuthVerify'));
        }}],
        { cancelable: false }
      )
    });
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
      this.setState({ loading: false, challenge: responseJson.challenge });
      this.getParticipation();
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

  getParticipation = () => {
    this.setState({loading: true});

    fetch('https://api.herce.co/v1/challenges/participated/' + this.state.challengeId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': this.state.accessToken
      }
    })
    .then(handleErrors)
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success == false) {
        this.setState({ participated: false });
        if (!this.state.challenge.started) this.connectSocket(this);
      } else {
        this.setState({ participated: true });
      }
      this.setState({loading: false});
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

  connectSocket = (context) => {
    // Creating the socket-client instance will automatically connect to the server.
    // Query parameters can also be provided, either with the query option
    // or directly in the url (example: http://localhost/users?token=abc)
    this.socket = io('https://api.herce.co/live');

    this.socket.on('connect', () => {
      var room = 'challenge-' + this.state.challenge.id;
      // Connected, let's sign-up for to receive messages for this room
      this.socket.emit('room', {room: room}, function (answer) { console.log(answer); });
    });

    this.socket.on('quickpress-challenge', function(payload) {
      context.setState({quickpress: payload});
    });
  }

  sendPress = (context) => {
    this.socket.emit('quickpress-challenge', {challengeId: this.state.challenge.id, userId: this.state.userId}, function (answer) {
      console.log(answer);
      if (answer.success) {
        context.setState({pressed: true});
      } else {
        Alert.alert(
          'Ocurrió un problema',
          answer.message,
          [{text: 'Aceptar', onPress: () => console.log('OK')}],
          { cancelable: false }
        );
      }
    });
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
      <View>
        <Text style={styles.heading2}>No se encontró el QuickPress</Text>
        <Text style={styles.heading3}>Lo sentimos, no pudimos encontrar el QuickPress. Intenta de nuevo.</Text>
      </View>
    );
  }

  StandBy = () => {
    return(
      <View>
        <Text style={styles.heading}>{this.state.challenge.name}</Text>
        <Text style={styles.heading2}>El QuickPress no ha comenzado</Text>
        <Text style={styles.heading3}>Puedes esperar aqui. La aplicación se actualizará automaticamente y verás la cuenta regresiva apenas comience el QuickPress.</Text>
        <Text style={styles.heading3}>Una vez terminada la cuenta regresiva, aparecerá un botón. Presiona el botón lo mas rápido que puedas, tu premio depende de tu velocidad.</Text>
      </View>
    );
  }

  Late = () => {
    return(
      <View>
        <Text style={styles.heading}>{this.state.challenge.name}</Text>
        <Text style={styles.heading2}>El QuickPress ya comenzó</Text>
        <Text style={styles.heading3}>Lo sentimos {this.state.name}, llegaste tarde. El QuickPress ya comenzó y los usuarios ya han participado. Suerte para la próxima.</Text>
      </View>
    );
  }

  Participated = () => {
    return(
      <View>
        <Text style={styles.heading}>{this.state.challenge.name}</Text>
        <Text style={styles.heading2}>Ya participaste</Text>
        <Text style={styles.heading3}>{this.state.name}, ya participaste en este QuickPress. Espera los resultados pronto.</Text>
      </View>
    );
  }

  Played = () => {
    return(
      <View>
        <Text style={styles.heading}>{this.state.challenge.name}</Text>
        <Text style={styles.heading2}>¡Gracias {this.state.name}!</Text>
        <Text style={styles.heading3}>Gracias por participar en este QuickPress. Los resultados se darán a conocer pronto.</Text>
      </View>
    );
  }

  CountDown = () => {
    return(
      <View>
        <Text style={styles.heading}>{this.state.challenge.name}</Text>
        <Text style={styles.countdown}>{this.state.quickpress.countdown}</Text>
        <Text style={styles.heading3}>¿Estas listo {this.state.name}? El QuickPress está comenzando.</Text>
        <Text style={styles.heading3}>En unos segundos, un botón aparecerá en pantalla. Oprime el boton lo mas rapido que puedas.</Text>
      </View>
    );
  }

  Challenge = () => {
    return(
      <View>
        <Text style={styles.heading}>{this.state.challenge.name}</Text>
        <Text style={styles.heading3}>{this.state.challenge.description}</Text>
        <Button style={styles.button} onPress={() => this.sendPress(this)}>
          <Text style={{ textAlign: "center", alignSelf: "center" }}>QuickPress</Text>
        </Button>
      </View>
    );
  }

  InnerContent = () => {
    if (this.state.loading) return <this.Loading/>;
    if(Object.keys(this.state.challenge).length > 0) {
      if (this.state.participated) {
        return <this.Participated/>;
      } else if (this.state.challenge.started) {
        return <this.Late/>;
      } else if (this.state.quickpress) {
        if (this.state.quickpress.enabled) {
          if (this.state.pressed) {
            return <this.Played/>;
          } else {
            return <this.Challenge/>;
          }
        } else {
          return <this.CountDown/>;
        }
      } else {
        return <this.StandBy/>;
      }
    } else {
      return <this.Empty/>;
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <Content style={styles.content}>
          <this.InnerContent/>
        </Content>
      </SafeAreaView>
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
    alignSelf: "center"
  },
  heading2: {
    fontSize: 22,
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: "center"
  },
  heading3: {
    fontSize: 18,
    marginTop: 5,
    marginTop: 10,
    alignSelf: "center",
    textAlign: "center"
  },
  countdown: {
    fontSize: 52,
    padding: 10,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    alignSelf: "center"
  },
  button: {
    marginTop: 25,
    marginBottom: 5,
    alignSelf: "center",
    backgroundColor: "#000",
  }
});
