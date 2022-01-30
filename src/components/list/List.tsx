import React from 'react';
import { FlatList } from 'react-native';
import { useSx } from 'dripsy';
import type { ListRenderItem } from 'react-native';
import type { SxProp } from 'dripsy';

type Props<T> = {
  data: (T & Item)[];
  renderItem: ListRenderItem<T & Item>;
  contentContainerStyle?: SxProp;
};

const List = <T extends Item>({
  data,
  renderItem,
  contentContainerStyle,
}: Props<T & Item>) => {
  const sx = useSx();

  return (
    <FlatList<T>
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, _) => item.id}
      contentContainerStyle={
        !!contentContainerStyle && sx(contentContainerStyle)
      }
    />
  );
};

export default List;
