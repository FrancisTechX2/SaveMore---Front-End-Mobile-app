import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { CustomTabBar } from '@/components/custom-tab-bar';
import { useSegments } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export const unstable_settings = {
  // Your app currently hides `(tabs)/index` and uses `home` as the visible first tab.
  initialRouteName: 'home',
};

export default function TabLayout() {
  const segments = useSegments();
  const lastTabRef = useRef<string | null>(null);

  // Enable liquid glass ONLY on iOS 26+.
  const iosVersion = Platform.OS === 'ios' ? Number(Platform.Version) : 0;
  const useNativeTabs = Platform.OS === 'ios' && iosVersion >= 26;

  const [reduceTransparencyEnabled, setReduceTransparencyEnabled] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AccessibilityInfo.isReduceTransparencyEnabled()
      .then(setReduceTransparencyEnabled)
      .catch(() => {});
  }, []);

  // Haptics on section (tab) changes for iOS 26+ NativeTabs.
  useEffect(() => {
    if (!useNativeTabs) return;

    // Expected segments: ['(tabs)', '<tabName>', ...]
    const tab = segments?.[1];
    if (typeof tab !== 'string') return;

    const allowedTabs = new Set(['home', 'plans', 'plus', 'report', 'account']);
    if (!allowedTabs.has(tab)) return;

    const prev = lastTabRef.current;
    if (prev && prev !== tab) {
      void Haptics.selectionAsync().catch(() => {});
    }
    lastTabRef.current = tab;
  }, [segments, useNativeTabs]);

  // Fallback: keep the existing JS/custom tab bar on Android + older iOS.
  if (!useNativeTabs) {
    return (
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="home" />
        <Tabs.Screen name="plans" />
        <Tabs.Screen name="plus" />
        <Tabs.Screen name="report" />
        <Tabs.Screen name="account" />
      </Tabs>
    );
  }

  // iOS 26+ (and simulators): NativeTabs liquid-glass bar with PLUS included.
  // Colors: black by default, orange (#FF6F00) when selected
  return (
    <NativeTabs
      blurEffect={reduceTransparencyEnabled ? 'none' : 'systemMaterial'}
      tintColor="#FF6F00"
      iconColor={{
        default: '#000000',
        selected: '#FF6F00',
      }}
    >
      <NativeTabs.Trigger name="plus">
        {/* PLUS first, same sizing, visually distinct via circle */}
        <Icon sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} />
        <Label hidden />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="home">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="plans">
        <Icon sf={{ default: 'doc.text', selected: 'doc.text.fill' }} />
        <Label>Plans</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="report">
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
        <Label>Report</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="account">
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
        <Label>Account</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
