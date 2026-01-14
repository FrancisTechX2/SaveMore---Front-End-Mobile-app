import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface ParallaxScrollViewProps {
  headerBackgroundColor?: { light?: string; dark?: string };
  headerImage?: React.ReactNode;
  children: React.ReactNode;
}

export default function ParallaxScrollView({ headerBackgroundColor, headerImage, children }: ParallaxScrollViewProps) {
  return (
    <ScrollView style={styles.container}>
      {headerImage && <View style={styles.headerImageContainer}>{headerImage}</View>}
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImageContainer: {
    position: 'relative',
  },
});

