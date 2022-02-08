import React, { useCallback, useMemo, useState } from 'react';
import { styled, H4, Pressable, useSx } from 'dripsy';
import { colord } from 'colord';
import Popover from '../popover';
import List from '../list';
import Icon from '../icon';
import theme from '../../configs';
import type { ReactElement, RefObject } from 'react';
import {
  ListRenderItem,
  StyleSheet,
  View as ReactNativeView,
} from 'react-native';
import type { SxProp } from 'dripsy';

type Props<T, S> = {
  data: Data<T>[];
  renderExhibitor: (
    ref: RefObject<S>,
    onPress: () => void,
    selected?: Data<T> | Data<T>[]
  ) => ReactElement;
  mode: 'single' | 'multi';
  contentContainerStyle?: SxProp;
  containerPositionTopOffset?: number;
  containerSx?: SxProp;
};
const Select = <T, S extends ReactNativeView>({
  data,
  renderExhibitor,
  mode,
  contentContainerStyle,
  containerPositionTopOffset,
  containerSx,
}: Props<T, S>) => {
  const sx = useSx();
  const [selected, setSelected] = useState<Data<T> | Data<T>[] | undefined>();

  const listContentContainerStyle = useMemo(
    () => StyleSheet.flatten([contentContainerStyle, sx({ p: '$1' })]),
    [contentContainerStyle]
  );

  const onListItemAdd = useCallback(
    (data: Data<T>) => {
      if (mode === 'single') {
        setSelected(data);
      } else if (mode === 'multi') {
        const current = (selected as Data<T>[]) || [];
        const newSelected = [...current, data];
        setSelected(newSelected);
      }
    },
    [selected]
  );

  const onListItemRemove = useCallback(
    (data: Data<T>) => {
      if (mode === 'single') {
        setSelected(undefined);
      } else if (mode === 'multi') {
        const newSelected = (selected as Data<T>[]).filter(
          (item) => item.id !== data.id
        );
        setSelected(newSelected);
      }
    },
    [selected]
  );

  const isSelected = useCallback(
    (data: Data<T>) => {
      if (mode === 'single') {
        const current = selected as Data<T>;
        const value = data.id === current?.id;
        return value;
      } else if (mode === 'multi') {
        const current = (selected as Data<T>[]) || [];
        const value = current.some((item) => item.id === data.id);
        return value;
      }
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
    <Popover<S, T>
      data={selected}
      renderExhibitor={renderExhibitor}
      containerPositionTopOffset={containerPositionTopOffset}
      containerSx={containerSx}
    >
      <List<Data<T>>
        data={data}
        renderItem={renderItem}
        withDivider={false}
        contentContainerStyle={listContentContainerStyle}
      />
    </Popover>
  );
};

type ListItemProps<T> = {
  item: Data<T>;
  selected?: boolean;
  onPress: (item: T) => void;
};
const ListItem = <T,>({ item, selected, onPress }: ListItemProps<T>) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [pressed, setPressed] = useState<boolean>(false);

  const backgroundColor = useMemo(
    () => getListItemBackgroundColor(selected, pressed, hovered),
    [selected, pressed, hovered]
  );

  const handleOnPress = useCallback(() => onPress(item), [item, onPress]);

  return (
    <ListItemContainer
      onPress={handleOnPress}
      // @ts-expect-error: wrong Pressable types
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      backgroundColor={backgroundColor}
    >
      {/* @ts-ignore: probably a bug in H5 types */}
      <Value>{item.value}</Value>
      {selected && (
        <Icon
          icon={{ pack: 'Feather', name: 'check' }}
          color={colord(theme.colors.$onSurface).alpha(0.9).toHex()}
          containerSx={{ paddingY: '$3', paddingX: '$4' }}
        />
      )}
    </ListItemContainer>
  );
};

const getListItemBackgroundColor = (
  selected?: boolean,
  pressed?: boolean,
  hovered?: boolean
): string | undefined => {
  if (pressed) return colord(theme.colors.$primary).alpha(0.075).toHex();
  if (selected) return colord(theme.colors.$primary).alpha(0.2).toHex();
  if (hovered) return colord(theme.colors.$primary).alpha(0.075).toHex();
  return undefined;
};

type ListItemContainerProps = { backgroundColor?: string };
const ListItemContainer = styled(Pressable)(
  ({ backgroundColor }: ListItemContainerProps) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.space.$3,
    backgroundColor,
    margin: '$1',
  })
);

const Value = styled(H4)(() => ({
  paddingX: '$4',
  paddingY: '$4',
  fontSize: '$2',
  color: '$onSurface',
}));

export default Select;
