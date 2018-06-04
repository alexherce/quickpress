import React, { Component } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { createSwitchNavigator, TabNavigator, createStackNavigator, withNavigation, AsyncStorage } from 'react-navigation';
import { Container, Button, Text, Icon, Footer, FooterTab, StyleProvider } from "native-base";

import getTheme from './native-base-theme/components';
import platform from './native-base-theme/variables/platform';

import {
  MainScreen,
  ChallengeScreen,
  AddScreen,
  SettingsScreen,
  LoginScreen,
  SignupScreen,
  AuthVerifyScreen
} from './app/screens/index';

console.ignoredYellowBox = ['Warning: isMounted(...)', 'Remote debugger'];

const MainStack = createStackNavigator(
  {
    Main: MainScreen,
    Challenge: ChallengeScreen
  },
  {
    initialRouteName: 'Main',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#00B16A',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  }
);

const AddStack = createStackNavigator(
  {
    Add: AddScreen,
  },
  {
    initialRouteName: 'Add',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#00B16A',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  }
);

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  {
    initialRouteName: 'Settings',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#00B16A',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  }
);

const TabStack = TabNavigator(
  {
    Main: MainStack,
    Add: AddStack,
    Settings: SettingsStack,
  },
  {
    initialRouteName: 'Main',
    tabBarPosition: "bottom",
    tabBarComponent: props => {
      return (
        <StyleProvider style={getTheme(platform)}>
          <Footer>
            <FooterTab>
              <Button
                vertical
                full
                active={props.navigationState.index === 0}
                onPress={() => props.navigation.navigate("Main")}>
                <Icon name="power" />
              </Button>
              <Button
                vertical
                full
                active={props.navigationState.index === 1}
                onPress={() => props.navigation.navigate("Add")}>
                <Icon name="add-circle" />
              </Button>
              <Button
                vertical
                full
                active={props.navigationState.index === 2}
                onPress={() => props.navigation.navigate("Settings")}>
                <Icon name="settings" />
              </Button>
            </FooterTab>
          </Footer>
        </StyleProvider>
      );
    }
  }
);

const AuthStack = createStackNavigator(
  {
    LogIn: LoginScreen,
    SignUp: SignupScreen
  },
  {
    initialRouteName: 'LogIn',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#00B16A',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const SwitchStack = createSwitchNavigator(
  {
    AuthVerify: AuthVerifyScreen,
    App: TabStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthVerify'
  }
);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#00B16A"
        />
        <SwitchStack />
      </Container>
    );
  }
}
