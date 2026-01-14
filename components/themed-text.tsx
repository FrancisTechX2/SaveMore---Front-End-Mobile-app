import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'default' | 'defaultSemiBold' | 'link';
  children: React.ReactNode;
}

export function ThemedText({ type, style, children, ...props }: ThemedTextProps) {
  return (
    <Text style={[styles.default, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    color: '#000000',
  },
});

