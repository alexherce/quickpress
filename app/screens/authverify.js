import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, StyleSheet, View, Dimensions } from 'react-native';
import { Container, Content, Text, Spinner } from 'native-base';

export class AuthVerifyScreen extends Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (accessToken) {
      this.props.navigation.navigate('App', {accessToken: accessToken});
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    const {height: screenHeight} = Dimensions.get('window');
    return (
      <Container>
        <Content>
          <View style={{
            height: screenHeight,
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center',
            backgroundColor: '#fff'
          }}>
            <Spinner size="large" color="#00B16A" />
          </View>
        </Content>
      </Container>
    );
  }
}
