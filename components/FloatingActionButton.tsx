import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, ViewStyle } from 'react-native';

// Only import liquid glass on iOS 26+
const isLiquidGlassSupported =
  Platform.OS === 'ios' && Number(Platform.Version) >= 26;

// Dynamically require liquid glass only when supported
let LiquidGlassView: React.ComponentType<any> | null = null;
if (isLiquidGlassSupported) {
  try {
    const liquidGlass = require('@callstack/liquid-glass');
    LiquidGlassView = liquidGlass.LiquidGlassView;
  } catch {
    // Failed to load, will use fallback
  }
}

interface FloatingActionButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Liquid-glass floating action button (iOS 26+ only).
 * On unsupported devices, this component returns null.
 */
export function FloatingActionButton({ onPress, style }: FloatingActionButtonProps) {
  // Don't render anything on unsupported devices
  if (!isLiquidGlassSupported || !LiquidGlassView) {
    return null;
  }

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        style,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
    >
      <LiquidGlassView
        style={styles.glass}
        effect="regular"
        tintColor="rgba(255, 111, 0, 0.9)"
        interactive={false}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </LiquidGlassView>
    </Pressable>
  );
}

const SIZE = 56;

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    overflow: 'hidden',
  },
  glass: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZE / 2,
    overflow: 'hidden',
  },
});
