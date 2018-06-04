import React, { Component } from 'react';
import { Platform, StyleSheet, View, Alert, AsyncStorage } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Spinner } from 'native-base';

function handleErrors(response) {
  if (!response.success) {
    throw Error(response.error);
  }
  return response;
}

export class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ongoingSignup: false
    };
  }

  doSignup = () => {
    this.setState({ongoingSignup: true});

    fetch('https://api.herce.co/v1/users/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": this.state.username,
        "email": this.state.email,
        "password": this.state.password,
        "password_verify": this.state.password_verify,
        "name": this.state.name,
        "second_name": this.state.second_name,
        "first_last_name": this.state.first_last_name,
        "second_last_name": this.state.second_last_name,
        "birth_day": this.state.birth_day,
        "birth_month": this.state.birth_month,
        "birth_year": this.state.birth_year,
        "mobile_phone": this.state.mobile_phone
      }),
    })
    .then((response) => response.json())
    .then(handleErrors)
    .then((responseJson) => {
      console.log(responseJson);
      this.props.navigation.navigate('LogIn');
    })
    .catch((error) => {
      console.log(error);
      this.setState({ongoingSignup: false});
      Alert.alert(
        'Ocurrió un problema',
        error.toString(),
        [{text: 'Aceptar', onPress: () => console.log('OK')}],
        { cancelable: false }
      )
    });
  }

  static navigationOptions = {
    title: 'Registro',
  };

  render() {
    return (
      <Content style={styles.content}>
        <Text style={styles.heading2}>¿Ya tienes cuenta?</Text>
        <Button transparent style={{ marginBottom: 5, alignSelf: "center" }} onPress={() => this.props.navigation.navigate('LogIn')}>
          <Text style={{ textAlign: "center", fontSize: 18, color: "#000" }}>
            Iniciar sesión
          </Text>
        </Button>
        <Text style={styles.heading}>Regístrate</Text>

        {this.state.ongoingSignup ? (
          <View>
            <Spinner size="large" color="#00B16A" />
            <Text style={styles.heading3}>Registrando usuario...</Text>
          </View>
        ) : (
          <View>
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
                <Label>Email</Label>
                <Input keyboardType={'email-address'}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  spellCheck={false}
                  onChangeText={(text) => this.setState({email: text})}
                  value={this.state.email}
                />
              </Item>
              <Item floatingLabel>
                <Label>Contraseña</Label>
                <Input secureTextEntry={true}
                  onChangeText={(text) => this.setState({password: text})}
                  value={this.state.password}
                />
              </Item>
              <Item floatingLabel>
                <Label>Verificar contraseña</Label>
                <Input secureTextEntry={true}
                  onChangeText={(text) => this.setState({password_verify: text})}
                  value={this.state.password_verify}
                />
              </Item>
              <Item floatingLabel>
                <Label>Nombre</Label>
                <Input
                  onChangeText={(text) => this.setState({name: text})}
                  value={this.state.name}
                />
              </Item>
              <Item floatingLabel>
                <Label>Segundo nombre (opcional)</Label>
                <Input
                  onChangeText={(text) => this.setState({second_name: text})}
                  value={this.state.second_name}
                />
              </Item>
              <Item floatingLabel>
                <Label>Apellido paterno</Label>
                <Input
                  onChangeText={(text) => this.setState({first_last_name: text})}
                  value={this.state.first_last_name}
                />
              </Item>
              <Item floatingLabel>
                <Label>Apellido materno</Label>
                <Input
                  onChangeText={(text) => this.setState({second_last_name: text})}
                  value={this.state.second_last_name}
                />
              </Item>
              <Item floatingLabel>
                <Label>Día de nacimiento</Label>
                <Input keyboardType={'numeric'} maxLength={2}
                  onChangeText={(text) => this.setState({birth_day: text})}
                  value={this.state.birth_day}
                />
              </Item>
              <Item floatingLabel>
                <Label>Mes de nacimiento</Label>
                <Input keyboardType={'numeric'} maxLength={2}
                  onChangeText={(text) => this.setState({birth_month: text})}
                  value={this.state.birth_month}
                />
              </Item>
              <Item floatingLabel>
                <Label>Año de nacimiento</Label>
                <Input keyboardType={'numeric'} maxLength={4}
                  onChangeText={(text) => this.setState({birth_year: text})}
                  value={this.state.birth_year}
                />
              </Item>
              <Item floatingLabel>
                <Label>Celular (10 dígitos)</Label>
                <Input keyboardType={'numeric'} maxLength={10}
                  onChangeText={(text) => this.setState({mobile_phone: text})}
                  value={this.state.mobile_phone}
                />
              </Item>
            </Form>
            <Button transparent full large>
              <Text style={{ textAlign: "center", fontSize: 14, color: "#AAA" }}>
                Al registrarte, aceptas los Términos y Condiciones y la Política de Privacidad de Quickpress.
              </Text>
            </Button>
            <Button style={styles.button} onPress={this.doSignup}>
              <Text style={{ textAlign: "center", alignSelf: "center" }}>Registrar</Text>
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
    marginTop: 5,
    marginBottom: 20,
    alignSelf: "center",
    backgroundColor: "#000",
  }
});
