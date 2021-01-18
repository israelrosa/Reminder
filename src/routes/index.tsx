import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Form from '../screens/Form';
import Reminder from '../screens/Reminder';
import Schedule from '../screens/Schedule';
//import Setting from '../screens/Setting';
import { theme } from '../styles/theme';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const ReminderScreens: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ReminderContent"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ReminderContent" component={Reminder} />
      <Stack.Screen name="ReminderForm" component={Form} />
    </Stack.Navigator>
  );
};

const ScheduleScreens: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ScheduleContent"
      screenOptions={{ headerShown: false }}
      mode="card"
    >
      <Stack.Screen name="ScheduleContent" component={Schedule} />
      <Stack.Screen name="ScheduleForm" component={Form} />
    </Stack.Navigator>
  );
};

const router: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: theme.primary,
          keyboardHidesTabBar: true,
          inactiveTintColor: theme.primary,
          showLabel: false,
          style: { shadowOpacity: 0, elevation: 0 },
        }}
      >
        <Tab.Screen
          name="Reminder"
          component={ReminderScreens}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'bookmark' : 'bookmark-outline'}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreens}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'today' : 'today-outline'}
                color={color}
                size={30}
              />
            ),
          }}
        />
        {/* <Tab.Screen
          name="Setting"
          component={Setting}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                color={color}
                size={30}
              />
            ),
          }}
        /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default router;
