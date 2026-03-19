import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    initialRouteName="pickups"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="pickups"
        options={{
          title: 'Pickups',
          tabBarIcon: ({ color }) => (
          <IconSymbol size={28} name="soccerball" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Rentals"
        options={{
          title: "Rentals",
          tabBarIcon: ({ color }) => (
          <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
    <Tabs.Screen
    name="friends"
    options={{
      title: "Friends",
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="person.2.fill" color={color} />
      ),
    }}
    /> 

    <Tabs.Screen
    name="messages"
    options={{
      title: "Messages",
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="message.fill" color={color} />
      ),
    }}
    />

    <Tabs.Screen
    name="Profile"
    options={{
      title: "Profile",
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="person.fill" color={color} />
      ),
    }}
    />
    </Tabs>
  );
}