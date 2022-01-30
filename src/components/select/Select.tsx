import React, { useState } from 'react';
import Popover from '../popover';
import List from '../list';
import type { ReactElement, RefObject } from 'react';
import type { ListRenderItem, View as ReactNativeView } from 'react-native';
import type { SxProp } from 'dripsy';

type Data<T> = Item & T;

type Props<T, S> = {
  data: Data<T>[];
  renderItem: ListRenderItem<T>;
  renderExhibitor: (
    selected: Data<T> | Data<T>[],
    ref: RefObject<S>,
    onPress: () => void
  ) => ReactElement;
  contentContainerStyle?: SxProp;
};
const Select = <T, S extends ReactNativeView>({
  data,
  renderItem,
  renderExhibitor,
  contentContainerStyle,
}: Props<T, S>) => {
  const [selected, setSelected] = useState<Data<T>[]>([]);

  return (
    <Popover<S>
      renderExhibitor={(ref, onPress) =>
        renderExhibitor(selected, ref, onPress)
      }
    >
      <List<Data<T>>
        data={data}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
      />
    </Popover>
  );
};

export default Select;
