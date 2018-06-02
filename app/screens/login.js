import React, { Component } from 'react';
import { Platform, StyleSheet, View, Alert, AsyncStorage } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Spinner } from 'native-base';

function handleErrors(response) {
  if (!response.success) {
    throw Error(response.error);
  }
  return response;
}

export class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ongoingLogin: false
    };
  }

  signIn = async (response) => {
    await AsyncStorage.multiSet([['accessToken', response.token], ['username', response.username], ['email', response.email], ['name', response.name], ['lastName', response.first_last_name]]);
    this.props.navigation.navigate('AuthLoading');
  };

  doLogin = () => {
    this.setState({ongoingLogin: true});

    fetch('https://api.herce.co/v1/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
    .then((response) => response.json())
    .then(handleErrors)
    .then((responseJson) => {
      console.log(responseJson);
      this.signIn(responseJson);
    })
    .catch((error) => {
      console.log(error);
      this.setState({ongoingLogin: false});
      Alert.alert(
        'Ocurrió un problema',
        error.toString(),
        [{text: 'Aceptar', onPress: () => console.log('OK')}],
        { cancelable: false }
      )
    });
  }

  static navigationOptions = {
    title: 'Iniciar sesión',
  };

  render() {
    return (
      <Content style={styles.content}>
        <Text style={styles.heading}>Bienvenido</Text>
        <Form>
          <Item floatingLabel>
            <Label>Usuario</Label>
            <Input
              autoCapitalize={'none'}
              autoCorrect={false}
              spellCheck={false}
              onChangeText={(text) => this.setState({username: text})}
              value={this.state.username}
            />
          </Item>
          <Item floatingLabel>
            <Label>Contraseña</Label>
            <Input secureTextEntry={true}
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
            />
          </Item>
        </Form>

        {this.state.ongoingLogin ? (
          <View>
            <Spinner size="large" color="#00B16A" />
            <Text style={styles.heading3}>Iniciando sesión...</Text>
          </View>
        ) : (
          <View>
            <Button style={styles.button} onPress={this.doLogin}>
              <Text style={{ textAlign: "center", alignSelf: "center" }}>Iniciar sesión</Text>
            </Button>
            <Button transparent style={{ marginBottom: 5, alignSelf: "center" }}>
              <Text style={{ textAlign: "center", fontSize: 14, color: "#AAA" }}>
                ¿Olvidaste tu contraseña?
              </Text>
            </Button>
            <Text style={styles.heading2}>¿No tienes cuenta? Es gratis</Text>
            <Button transparent style={{ marginBottom: 5, alignSelf: "center" }}>
              <Text style={{ textAlign: "center", fontSize: 18, color: "#000" }}>
                Crear cuenta
              </Text>
            </Button>
          </View>
        )}
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
