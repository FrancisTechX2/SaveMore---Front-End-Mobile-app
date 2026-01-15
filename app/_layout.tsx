import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { FloatingActionButton } from '@/components/FloatingActionButton';

// Keep splash screen visible while app loads
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();

  // Show FAB only on iOS 26+ (liquid glass) and only when in tabs
  const iosVersion = Platform.OS === 'ios' ? Number(Platform.Version) : 0;
  const isLiquidGlass = Platform.OS === 'ios' && iosVersion >= 26;
  const isInTabs = segments[0] === '(tabs)';
  const showFAB = isLiquidGlass && isInTabs;

  useEffect(() => {
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleFABPress = () => {
    // TODO: Add your action here
    console.log('FAB pressed');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-transaction"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>

      {/* Floating Action Button - only for liquid glass (iOS 26+) */}
      {showFAB && (
        <View style={styles.fabContainer} pointerEvents="box-none">
          <FloatingActionButton onPress={handleFABPress} />
        </View>
      )}

      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 100, // Above the tab bar
    right: 20,
  },
});

