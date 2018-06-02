import React, { Component } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { createSwitchNavigator, TabNavigator, createStackNavigator, withNavigation, AsyncStorage } from 'react-navigation';
import { Container, Button, Text, Icon, Footer, FooterTab, StyleProvider } from "native-base";

import getTheme from './native-base-theme/components';
import platform from './native-base-theme/variables/platform';

import { MainScreen, SettingsScreen, LoginScreen, AuthLoadingScreen } from './app/screens/index';

console.ignoredYellowBox = ['Warning: isMounted(...)', 'Remote debugger'];

const MainStack = createStackNavigator(
  {
    Main: MainScreen,
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
    Settings: SettingsStack,
  },
  {
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
                <Text>Lucy</Text>
              </Button>
              <Button
                vertical
                full
                active={props.navigationState.index === 1}
                onPress={() => props.navigation.navigate("Settings")}>
                <Icon name="briefcase" />
                <Text>Nine</Text>
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
    AuthLoading: AuthLoadingScreen,
    App: TabStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading'
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
