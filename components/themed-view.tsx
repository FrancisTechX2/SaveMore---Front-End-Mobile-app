import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface ThemedViewProps extends ViewProps {
  children: React.ReactNode;
}

export function ThemedView({ style, children, ...props }: ThemedViewProps) {
  return (
    <View style={[styles.default, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: 'transparent',
  },
});

