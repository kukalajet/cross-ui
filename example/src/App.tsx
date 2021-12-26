import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { multiply, CrossProvider, Button } from 'cross-ui';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <CrossProvider>
      <View style={styles.container}>
        <Text>Result: {result}</Text>
        <Button type="filled" onPress={() => null} />
      </View>
    </CrossProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
