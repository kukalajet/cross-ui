import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { multiply, CrossProvider, Button, TextInput, Modal } from 'cross-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <SafeAreaProvider>
      <CrossProvider>
        <View style={styles.container}>
          <View style={{ paddingVertical: 8 }}>
            <Button
              label="OK"
              type="tonal"
              onPress={() => setModalOpen(true)}
            />
          </View>
          <Modal
            open={modalOpen}
            label="Modal"
            withScrollView
            onDismiss={() => setModalOpen(false)}
            onRemove={() => setModalOpen(false)}
          >
            <React.Fragment>
              <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <TextInput
                  label="Test"
                  initialValue="test"
                  width="25%"
                  error="test error"
                  pressable={true}
                  multiline={true}
                />
              </View>
              <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <TextInput
                  label="Test"
                  initialValue="test"
                  width="50%"
                  pressable={true}
                  multiline={true}
                />
              </View>
              <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <TextInput
                  label="Test"
                  initialValue="test"
                  width="100%"
                  pressable={true}
                  multiline={true}
                />
              </View>
              <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <TextInput
                  label="Test"
                  initialValue="test"
                  width="25%"
                  error="test error"
                  pressable={true}
                  multiline={true}
                />
              </View>
              <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <TextInput
                  label="Test"
                  initialValue="test"
                  width="50%"
                  pressable={true}
                  multiline={true}
                />
              </View>
              <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <TextInput
                  label="Test"
                  initialValue="test"
                  width="100%"
                  pressable={true}
                  multiline={true}
                  disabled={true}
                />
              </View>
            </React.Fragment>
          </Modal>
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
              trailingIcon={{ pack: 'Feather', name: 'x' }}
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
              label="BIG BUTTON"
              type="outlined"
              width="100%"
              onPress={() => null}
            />
          </View>
          <View style={{ paddingVertical: 8 }}>
            <Button
              label="BUTTON"
              type="tonal"
              width="75%"
              onPress={() => null}
            />
          </View>
        </View>
      </CrossProvider>
    </SafeAreaProvider>
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
