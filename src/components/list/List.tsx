import React from 'react';
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
  contentContainerStyle?: SxProp;
};

const List = <T extends Item>({
  data,
  renderItem,
  bounces = false,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
}: Props<T & Item>) => {
  const sx = useSx();

  return (
    <FlatList<T>
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <Divider />}
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
