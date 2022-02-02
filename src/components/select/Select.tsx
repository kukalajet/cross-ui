import React, { useCallback, useState } from 'react';
import { styled, H4, Pressable } from 'dripsy';
import Popover from '../popover';
import List from '../list';
import Icon from '../icon';
import theme from '../../configs';
import type { ReactElement, RefObject } from 'react';
import type { ListRenderItem, View as ReactNativeView } from 'react-native';
import type { SxProp } from 'dripsy';

type Data<T> = Item & T;

type Props<T, S> = {
  data: Data<T>[];
  renderExhibitor: (ref: RefObject<S>, onPress: () => void) => ReactElement;
  contentContainerStyle?: SxProp;
};
const Select = <T, S extends ReactNativeView>({
  data,
  renderExhibitor,
  contentContainerStyle,
}: Props<T, S>) => {
  const [selected, setSelected] = useState<Data<T>[]>([]);

  const onListItemAdd = useCallback(
    (data: Data<T>) => {
      const newSelected = [...selected, data];
      setSelected(newSelected);
    },
    [selected]
  );

  const onListItemRemove = useCallback(
    (data: Data<T>) => {
      const newSelected = selected.filter((item) => item.id !== data.id);
      setSelected(newSelected);
    },
    [selected]
  );

  const isSelected = useCallback(
    (data: Data<T>) => {
      const value = selected.some((item) => item.id === data.id);
      return value;
    },
    [selected]
  );

  const renderItem: ListRenderItem<Data<T>> = ({ item }) => {
    const selected = isSelected(item);

    const handleOnPress = (item: Data<T>) => {
      if (!selected) onListItemAdd(item);
      if (selected) onListItemRemove(item);
    };

    return (
      <ListItem<Data<T>>
        item={item}
        selected={selected}
        onPress={handleOnPress}
      />
    );
  };

  return (
    <Popover<S> renderExhibitor={renderExhibitor}>
      <List<Data<T>>
        data={data}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
      />
    </Popover>
  );
};

type ListItemProps<T> = {
  item: Data<T>;
  selected: boolean;
  onPress: (item: T) => void;
};
const ListItem = <T,>({ item, selected, onPress }: ListItemProps<T>) => {
  const handleOnPress = useCallback(() => onPress(item), [item, onPress]);

  return (
    <ListItemContainer onPress={handleOnPress}>
      {/* @ts-ignore: probably a bug in H5 types */}
      <Value>{item.value}</Value>
      {selected && (
        <Icon
          icon={{ pack: 'Feather', name: 'check' }}
          color={theme.colors.$onSurface}
          containerSx={{ paddingY: '$2', paddingX: '$4' }}
        />
      )}
    </ListItemContainer>
  );
};

const ListItemContainer = styled(Pressable)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const Value = styled(H4)(() => ({
  paddingX: '$4',
  paddingY: '$3',
  fontSize: '$2',
  color: '$onSurface',
}));

export default Select;
