import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { multiply, CrossProvider, Button, TextInput } from 'cross-ui';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <CrossProvider>
      <View style={styles.container}>
        <Text>Result: {result}</Text>
        <View
          style={{
            paddingVertical: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <TextInput
            label="Test"
            initialValue="test"
            width="25%"
            multiline={true}
          />
          <TextInput
            label="Test"
            initialValue="test"
            width="25%"
            multiline={true}
          />
        </View>
        <View style={{ paddingVertical: 8 }}>
          <TextInput
            label="Test"
            initialValue="test"
            width="50%"
            leadingIcon={{ pack: 'Feather', name: 'x' }}
            error="Conduct a conversion-focused copy teardown of your sales page."
          />
        </View>
        <View style={{ paddingVertical: 8 }}>
          <TextInput
            label="Test"
            initialValue="test"
            width="100%"
            trailingIcon={{ pack: 'Feather', name: 'x' }}
            error="Conduct a conversion-focused copy teardown of your sales page."
          />
        </View>
        <View style={{ paddingVertical: 8 }}>
          <TextInput
            label="Test"
            initialValue="test"
            width="25%"
            multiline={true}
          />
        </View>
        <View style={{ paddingVertical: 8 }}>
          <Button
            icon={{ pack: 'Feather', name: 'x' }}
            label="test"
            type="filled"
            onPress={() => null}
          />
        </View>
        <View style={{ paddingVertical: 8 }}>
          <Button
            icon={{ pack: 'Feather', name: 'x' }}
            label="test"
            type="elevated"
            onPress={() => null}
          />
        </View>
        <View style={{ paddingVertical: 8 }}>
          <Button
            icon={{ pack: 'MaterialIcons', name: 'close' }}
            label="test"
            type="outlined"
            onPress={() => null}
          />
        </View>
        <View style={{ paddingVertical: 8 }}>
          <Button
            icon={{ pack: 'AntDesign', name: 'close' }}
            label="test"
            type="tonal"
            onPress={() => null}
          />
        </View>
        <View style={{ paddingVertical: 8, flexDirection: 'row' }}>
          <View style={{ paddingEnd: 8 }}>
            <Button
              icon={{ pack: 'AntDesign', name: 'close' }}
              type="elevated"
              onPress={() => null}
            />
          </View>
          <View style={{ paddingEnd: 8 }}>
            <Button
              icon={{ pack: 'AntDesign', name: 'close' }}
              type="outlined"
              onPress={() => null}
            />
          </View>
        </View>
        <View style={{ paddingVertical: 8 }}>
          <Button
            icon={{ pack: 'AntDesign', name: 'close' }}
            label="test"
            type="outlined"
            width="100%"
            onPress={() => null}
          />
        </View>
      </View>
    </CrossProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
