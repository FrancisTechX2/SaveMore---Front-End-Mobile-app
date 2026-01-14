import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICON_COLOR = '#9CA3AF';
const ACTIVE_COLOR = '#FF6F00';
const CENTER_BUTTON_COLOR = '#FF6F00';
const BAR_BG = '#FFFFFF';

const TAB_BAR_HEIGHT = 75;
const CENTER_BUTTON_SIZE = 62;
const BUMP_SIZE = 72;
// Shared centerline so bump + button share the exact same center on every device.
// This guarantees the white border thickness is perfectly even on all sides.
const CENTER_Y = 10;
const BOTTOM_FLOAT_GAP = 12; // lifts the whole bar slightly above the home indicator

// Set to true to see tap areas (debug mode)
const DEBUG_TAP_AREAS = false;

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const rowWidthRef = useRef(0);
  const lastHoverIndexRef = useRef<number | null>(null);

  const triggerHaptic = () => {
    // Subtle native tap feedback; safely no-op if unavailable (e.g. simulator/web).
    void Haptics.selectionAsync().catch(() => {});
  };

  const triggerHapticForScrub = (locationX: number) => {
    const width = rowWidthRef.current;
    if (!width || width <= 0) return;

    // The row is 5 equal flex segments: home, plans, (center space), report, account.
    const segmentWidth = width / 5;
    const idx = Math.max(0, Math.min(4, Math.floor(locationX / segmentWidth)));

    if (lastHoverIndexRef.current !== idx) {
      lastHoverIndexRef.current = idx;
      triggerHaptic();
    }
  };

  const tabs = [
    { name: 'home', icon: 'home-outline' as const, label: 'Home' },
    { name: 'plans', icon: 'document-outline' as const, label: 'Plans' },
    { name: 'plus', icon: 'add' as const, label: '' },
    { name: 'report', icon: 'bar-chart-outline' as const, label: 'Report' },
    { name: 'account', icon: 'person-outline' as const, label: 'Account' },
  ];

  const handlePress = (tabName: string) => {
    navigation.navigate(tabName);
  };

  return (
    <View style={[styles.container, { bottom: BOTTOM_FLOAT_GAP }]}>
      <View pointerEvents="none" style={styles.bump} />

      {/* Main bar that fills to bottom */}
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom - 12, 10) }]}>
        <View
          style={styles.tabsRow}
          onLayout={(e) => {
            rowWidthRef.current = e.nativeEvent.layout.width;
          }}
          onTouchStart={(e) => {
            triggerHapticForScrub(e.nativeEvent.locationX);
          }}
          onTouchMove={(e) => {
            triggerHapticForScrub(e.nativeEvent.locationX);
          }}
          onTouchEnd={() => {
            lastHoverIndexRef.current = null;
          }}
          onTouchCancel={() => {
            lastHoverIndexRef.current = null;
          }}
        >
          {tabs.map((tab) => {
            if (tab.name === 'plus') {
              return <View key={tab.name} style={styles.centerSpace} />;
            }

            // Get current active route name
            const currentRoute = state.routes[state.index]?.name;
            // Also treat 'index' as 'home' since index redirects to home
            const isActive =
              (currentRoute === tab.name || (currentRoute === 'index' && tab.name === 'home')) && currentRoute !== 'plus';
            const color = isActive ? ACTIVE_COLOR : ICON_COLOR;

            return (
              <Pressable
                key={tab.name}
                style={({ pressed }) => [
                  styles.tabItem,
                  { opacity: pressed ? 0.5 : 1 },
                  DEBUG_TAP_AREAS && { backgroundColor: 'rgba(255,0,0,0.3)' }
                ]}
                onPress={() => {
                  triggerHaptic();
                  console.log('TAB PRESSED:', tab.name);
                  handlePress(tab.name);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}
              >
                <View pointerEvents="none">
                  <Ionicons name={tab.icon} size={24} color={color} />
                </View>
                <Text style={[styles.label, { color }]} pointerEvents="none">
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Floating center button */}
      <View style={styles.centerButtonWrapper} pointerEvents="box-none">
        <Pressable
          style={({ pressed }) => [
            styles.centerButton,
            { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
          ]}
          onPress={() => {
            triggerHaptic();
            console.log('PLUS PRESSED');
            handlePress('plus');
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View pointerEvents="none">
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    backgroundColor: BAR_BG,
    justifyContent: 'flex-start',
  },
  bump: {
    position: 'absolute',
    top: CENTER_Y - BUMP_SIZE / 2,
    left: '50%',
    width: BUMP_SIZE,
    height: BUMP_SIZE,
    borderRadius: BUMP_SIZE / 2,
    backgroundColor: BAR_BG,
    transform: [{ translateX: -(BUMP_SIZE / 2) }],
    zIndex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: TAB_BAR_HEIGHT,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_BAR_HEIGHT,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: ICON_COLOR,
    marginTop: 4,
  },
  centerSpace: {
    flex: 1,
  },
  centerButtonWrapper: {
    position: 'absolute',
    top: CENTER_Y - CENTER_BUTTON_SIZE / 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  centerButton: {
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    backgroundColor: CENTER_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CENTER_BUTTON_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
});
