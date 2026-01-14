import { StyleSheet, Text, View } from 'react-native';

export default function AddTransactionModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

