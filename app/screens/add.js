import React, { Component } from 'react';
import { Platform, StyleSheet, View, Alert, SafeAreaView, AsyncStorage } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Form, Item, Input, Label, Spinner, Button } from 'native-base';

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

export class AddScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: '',
      challengeCode: '',
      loading: false
    }
  }

  static navigationOptions = {
    title: 'Añadir',
  };

  componentDidMount() {
    this.getAccessToken();
  }

  getAccessToken = () => {
    this.setState({loading: true});
    AsyncStorage.getItem('accessToken')
    .then((accessToken) => {
      this.setState({loading: false, accessToken: accessToken});
    });
  };

  doSubscribe = () => {
    this.setState({loading: true});

    fetch('https://api.herce.co/v1/challenges/subscribe', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': this.state.accessToken
      },
      body: JSON.stringify({
        code: this.state.challengeCode,
      }),
    })
    .then(handleErrors)
    .then((response) => response.json())
    .then(handleResponse)
    .then((responseJson) => {
      this.setState({loading: false});
      Alert.alert(
        '¡Listo!',
        'El QuickPress se ha añadido a tu cuenta. Ya puedes participar en el.',
        [{text: 'Aceptar', onPress: () => console.log('OK')}],
        { cancelable: false }
      )
    })
    .catch((error) => {
      console.log(error);
      this.setState({loading: false});
      Alert.alert(
        'Ocurrió un problema',
        error.toString(),
        [{text: 'Aceptar', onPress: () => console.log('OK')}],
        { cancelable: false }
      )
    });
  }

  Loading = () => {
    return(
      <View>
        <Spinner size="large" color="#00B16A" />
        <Text style={styles.heading3}>Añadiendo QuickPress...</Text>
      </View>
    );
  }

  AddChallenge = () => {
    return(
      <View>
        <Text style={styles.heading}>Nuevo QuickPress</Text>
        <Text style={styles.heading3}>Añade un QuickPress para poder participar. Los QuickPress tienen un código de 4 digitos, ingresalo.</Text>
        <Form>
          <Item floatingLabel>
            <Label>Código (4 digitos)</Label>
            <Input keyboardType={'numeric'} maxLength={4}
              onChangeText={(text) => this.setState({challengeCode: text})}
              value={this.state.mobile_phone}
            />
          </Item>
        </Form>
        <Button rounded style={styles.button} onPress={this.doSubscribe}>
          <Text style={{ textAlign: "center", alignSelf: "center" }}>Añadir</Text>
        </Button>
      </View>
    );
  }

  InnerContent = () => {
    if (this.state.loading) return <this.Loading/>;
    return <this.AddChallenge/>;
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
    padding: 5,
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
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: "center"
  },
  heading3: {
    fontSize: 20,
    marginTop: 5,
    alignSelf: "center",
    textAlign: "center"
  },
  button: {
    marginTop: 25,
    marginBottom: 5,
    alignSelf: "center",
    backgroundColor: "#000",
  }
});
