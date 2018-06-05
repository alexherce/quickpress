import React, { Component } from 'react';
import { Platform, StyleSheet, View, AsyncStorage, SafeAreaView } from 'react-native';
import { Container, Header, Content, List, ListItem, Text } from 'native-base';

export class SettingsScreen extends Component {

  doLogout = () => {
    AsyncStorage.removeItem('accessToken')
    .then(() => this.props.navigation.navigate('AuthVerify'));
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <Content>
          <List>
            <ListItem button={true} onPress={this.doLogout}>
              <Text>Log out</Text>
            </ListItem>
            <ListItem>
              <Text>Setting 2</Text>
            </ListItem>
            <ListItem>
              <Text>Setting 3</Text>
            </ListItem>
            <ListItem>
              <Text>Setting 4</Text>
            </ListItem>
          </List>
        </Content>
      </SafeAreaView>
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
