import React, { useMemo } from 'react';
import { FlatList } from 'react-native';
import { useSx } from 'dripsy';
import Divider from '../divider';
import type { ListRenderItem } from 'react-native';
import type { SxProp } from 'dripsy';

type Props<T> = {
  data: (T & Item)[];
  renderItem: ListRenderItem<T & Item>;
  bounces?: boolean;
  showsVerticalScrollIndicator?: boolean;
  withDivider?: boolean;
  contentContainerStyle?: SxProp;
};

const List = <T extends Item>({
  data,
  renderItem,
  bounces = false,
  showsVerticalScrollIndicator = false,
  withDivider,
  contentContainerStyle,
}: Props<T & Item>) => {
  const sx = useSx();

  const ItemSeparator = useMemo(
    () => (withDivider ? <Divider /> : null),
    [withDivider]
  );

  return (
    <FlatList<T>
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={() => ItemSeparator}
      bounces={bounces}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      keyExtractor={(item, _) => item.id}
      contentContainerStyle={
        !!contentContainerStyle && sx(contentContainerStyle)
      }
    />
  );
};

export default List;
