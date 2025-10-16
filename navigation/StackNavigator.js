import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import AccountScreen from '../screens/AccountScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateExpense from '../screens/CreateExpense';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, Text, View} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {NavigationContainer} from '@react-navigation/native';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={() => ({
          tabBarShowLabel: false,
          tabBarStyle: {height: 90},
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons name="shuffle-outline" size={30} color={'#E97451'} />
              ) : (
                <Ionicons name="shuffle-outline" size={30} color={'#A0A0A0'} />
              ),
          }}
        />

        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons
                  name="bar-chart-outline"
                  size={30}
                  color={'#E97451'}
                />
              ) : (
                <Ionicons
                  name="bar-chart-outline"
                  size={30}
                  color={'#A0A0A0'}
                />
              ),
          }}
        />

        <Tab.Screen
          name="Accounts"
          component={AccountScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons name="card-outline" size={30} color={'#E97451'} />
              ) : (
                <Ionicons name="card-outline" size={30} color={'#A0A0A0'} />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color={'#E97451'}
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={30}
                  color={'#A0A0A0'}
                />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  function MainStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Create"
          component={CreateExpense}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
