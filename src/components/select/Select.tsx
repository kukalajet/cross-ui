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

  const onListItemPress = useCallback(
    (item: Data<T>) => {
      const newSelected = [...selected, item];
      setSelected(newSelected);
    },
    [selected]
  );

  const isSelected = useCallback(
    (item: Data<T>) => {
      const value = selected.some((element) => element.id === item.id);
      return value;
    },
    [selected]
  );

  const renderItem: ListRenderItem<Data<T>> = ({ item }) => {
    const selected = isSelected(item);

    return (
      <ListItem<Data<T>>
        item={item}
        selected={selected}
        onPress={onListItemPress}
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
          containerSx={{ marginY: '$1', marginRight: 0, marginLeft: 0 }}
        />
      )}
    </ListItemContainer>
  );
};

const ListItemContainer = styled(Pressable)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingX: '$1',
  paddingY: '$4',
}));

const Value = styled(H4)(() => ({
  marginX: '$3',
  fontSize: '$2',
  color: '$onSurface',
}));

export default Select;
