import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  multiply,
  CrossProvider,
  Button,
  TextInput,
  Modal,
  Select,
  Popover,
} from 'cross-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Test = { color: string };

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
          <Select<{ id: string; value: string; color: string }, View>
            mode="single"
            data={[
              { id: '1', value: 'Test1', color: 'color1' },
              { id: '2', value: 'Test3', color: 'color2' },
              { id: '3', value: 'Test3', color: 'color3' },
              { id: '4', value: 'Test4', color: 'color4' },
              { id: '5', value: 'Test5', color: 'color5' },
              { id: '6', value: 'Test6', color: 'color6' },
              { id: '7', value: 'Test7', color: 'color7' },
              { id: '8', value: 'Test8', color: 'color8' },
              { id: '9', value: 'Test9', color: 'color9' },
              { id: '10', value: 'Test10', color: 'color10' },
            ]}
            renderExhibitor={(ref, handleMountPress, selected) => {
              const processed = Array.isArray(selected)
                ? selected?.map((item) => item.value)
                : selected?.value;
              const all = Array.isArray(selected)
                ? processed?.join(' - ')
                : processed;

              return (
                <View style={{ height: 100, width: 300, paddingTop: 40 }}>
                  <TextInput
                    ref={ref}
                    pressable={false}
                    // placeholder={all}
                    value={all}
                    initialValue={'all'}
                    onContainerPress={() => {
                      console.log('pressed');
                      handleMountPress();
                    }}
                  />
                </View>
              );
            }}
          />
          {/* <Select<{ id: string; value: string; color: string }, View>
            data={[
              { id: '1', value: 'Test1', color: 'color1' },
              { id: '2', value: 'Test3', color: 'color2' },
              { id: '3', value: 'Test3', color: 'color3' },
              { id: '4', value: 'Test4', color: 'color4' },
              { id: '5', value: 'Test5', color: 'color5' },
              { id: '6', value: 'Test6', color: 'color6' },
              { id: '7', value: 'Test7', color: 'color7' },
              { id: '8', value: 'Test8', color: 'color8' },
              { id: '9', value: 'Test9', color: 'color9' },
              { id: '10', value: 'Test10', color: 'color10' },
              { id: '11', value: 'Test11', color: 'color11' },
              { id: '12', value: 'Test12', color: 'color12' },
              { id: '13', value: 'Test13', color: 'color13' },
              { id: '14', value: 'Test14', color: 'color14' },
              { id: '15', value: 'Test15', color: 'color15' },
              { id: '16', value: 'Test16', color: 'color16' },
              { id: '17', value: 'Test17', color: 'color17' },
              { id: '18', value: 'Test18', color: 'color18' },
              { id: '19', value: 'Test19', color: 'color19' },
            ]}
            // renderItem={({ item, index }) => <Text>{item.color}</Text>}
            renderExhibitor={(ref, handleMountPress) => (
              // @ts-ignore
              <Pressable
                ref={ref}
                onPress={handleMountPress}
                style={{ padding: 20, backgroundColor: 'yellow' }}
              >
                <Text>TESTING APP</Text>
              </Pressable>
            )}
            // contentContainerStyle={{ flex: 1, paddingX: '$2', paddingY: '$2' }}
          /> */}
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
    backgroundColor: '#F9E9F9',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
