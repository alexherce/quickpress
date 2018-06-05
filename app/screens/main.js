import React, { Component } from 'react';
import { Platform, StyleSheet, StatusBar, Alert, AsyncStorage, View, RefreshControl, SafeAreaView } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Button, Body, Right, Icon, Spinner } from 'native-base';

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

export class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: '',
      challenges: [],
      loading: false
    }
  }

  static navigationOptions = {
    title: 'QuickPress',
  };

  componentDidMount() {
    this.getAccessToken();
  }

  getAccessToken = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (accessToken) {
      this.setState({accessToken: accessToken}, () => {
        this.getChallenges();
      });
    } else {
      this.props.navigation.navigate('AuthVerify');
    }
  };

  getChallenges = () => {
    this.setState({loading: true});

    fetch('https://api.herce.co/v1/challenges/list', {
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
        challenges: responseJson.challenges
      });
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

  Loading = () => {
    return(
      <View>
        <Spinner size="large" color="#00B16A" />
        <Text style={styles.heading3}>Cargando tus QuickPress...</Text>
      </View>
    );
  }

  List = () => {
    return(
      <List>
        {this.state.challenges.map((option, i)=><ItemList key={i} indx={i + 1} item={option} nav={this.props.navigation} accessToken={this.state.accessToken} />)}
      </List>
    );
  }

  Empty = () => {
    return(
      <Text style={styles.heading2}>No tienes ningún QuickPress</Text>
    );
  }

  InnerContent = () => {
    if (this.state.loading) return <this.Loading/>;
    if(this.state.challenges.length < 1) {
      return <this.Empty/>;
    } else {
      return <this.List/>;
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <Content style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.getChallenges}
            />
          }>
          <this.InnerContent/>
        </Content>
      </SafeAreaView>
    );
  }
}


class ItemList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ListItem button={true} onPress={() => this.props.nav.navigate('Challenge', {id: this.props.item.id, accessToken: this.props.accessToken})}>
        <Body>
          <Text>{this.props.item.name}</Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }
}


const styles = StyleSheet.create({
  content: {
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
