import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />

    <Tabs.Screen
        name="habits"
        options={{ title: 'habits' }}
      />

    <Tabs.Screen
        name="category"
        options={{ title: 'categories' }}
      />

      <Tabs.Screen
        name="account"
        options={{ title: 'Account' }}
      />
    </Tabs>
  );
}