import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreenContainer from '../screens/HomeScreen';
import PendingScreenContainer from '../screens/PendingScreen';
import LinksScreen from '../screens/LinksScreen';
import AgendaScreenContainer from '../screens/SettingsScreen';
import SettingsScreenOrig from '../screens/SettingsScreen-orig';
import ModifyVisitScreen from '../screens/ModifyVisit';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: { screen: HomeScreenContainer },
    SettingScreenOrig: { screen: SettingsScreenOrig },
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Schedule',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? `ios-calendar${focused ? '' : '-outline'}` : 'md-calendar'}
    />
  ),
};

HomeStack.path = '';

const PendingStack = createStackNavigator(
  {
    Pending: { screen: PendingScreenContainer },
  },
  config
);

PendingStack.navigationOptions = {
  tabBarLabel: 'Pending',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-hourglass' : 'md-hourglass'} />
  ),
};

PendingStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: AgendaScreenContainer,
    ModifyVisit: ModifyVisitScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Chronicle',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-clock' : 'md-clock'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  PendingStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
