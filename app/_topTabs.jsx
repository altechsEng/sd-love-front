import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MatchScreen from './screens/match';
 
// Create tab navigator
const Tab = createMaterialTopTabNavigator();

 
 

 
export default function TopTabs() {
  return (
    
      <Tab.Navigator 
      initialRouteName='side-cards'
      sceneContainerStyle={{ backgroundColor: "white" }}
      >
        <Tab.Screen 
        name="side-cards" 
        component={MatchScreen}/>
        <Tab.Screen 
        name="grid-cards" 
        component={MatchScreen}/>
        <Tab.Screen 
        name="box-address" 
        component={MatchScreen}/>
        <Tab.Screen 
        name="filter-cards" 
        component={MatchScreen}/>
 
      </Tab.Navigator>
  
  );
}