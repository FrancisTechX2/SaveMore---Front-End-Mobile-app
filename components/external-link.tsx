import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';

export const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(href)}>
      <Text style={{ color: 'blue' }}>{children}</Text>
    </TouchableOpacity>
  );
};

