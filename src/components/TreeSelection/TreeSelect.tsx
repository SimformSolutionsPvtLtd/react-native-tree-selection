import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { dummyTreeData } from '../../constants';
import styles from './styles';
import type {
  IItems,
  ItemTypes,
  SubcategoryDataTypes,
  TreeSelectTypes,
} from './types';

const TreeSelect = ({
  treeData,
  parentOnPress = ([]) => {},
  childOnPress = (_value: {}) => {},
}: TreeSelectTypes) => {
  const [listData, setListData] = useState(treeData ?? dummyTreeData);
  const [refresh, setRefresh] = useState<boolean>(false);

  const checkRender = useCallback((data: Array<SubcategoryDataTypes>) => {
    if (!data?.hasOwnProperty('isExpanded')) {
      data.map((item: SubcategoryDataTypes) => {
        if (!item?.hasOwnProperty('id')) {
          item.isExpanded = false;
        }
      });
    }
    data.map(item => {
      item?.subcategory?.length > 0 &&
        checkRender(item?.subcategory as unknown as []);
    });
  }, []);

  useEffect(() => {
    checkRender(listData as unknown as []);
    setListData(listData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressItems = (item: IItems) => {
    parentOnPress([item?.category_name, item?.category_id]);
    item.isExpanded = !item?.isExpanded;
    setRefresh(!refresh);
  };

  const renderTree = ({ item }: ItemTypes): JSX.Element => {
    return (
      <>
        {item?.category_name && (
          <TouchableOpacity
            onPress={() => {
              onPressItems(item);
            }}
            style={styles.parentStyles}>
            <Text style={styles.text}>{item?.category_name}</Text>
          </TouchableOpacity>
        )}
        {item?.value && (
          <TouchableOpacity onPress={() => childOnPress(item)}>
            <Text style={styles.text}>{item?.value}</Text>
          </TouchableOpacity>
        )}
        <View>
          {item?.subcategory?.length > 0 && item?.isExpanded && (
            <View style={styles.innerContainer}>
              <FlatList
                data={item?.subcategory as unknown as []}
                renderItem={renderTree}
                keyExtractor={(data, index) =>
                  `${index}uniquie ID${data?.category_id}`
                }
              />
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listData as unknown as []}
        renderItem={renderTree}
        keyExtractor={(data, index) => `${index}${data?.category_id}`}
        extraData={refresh}
      />
    </SafeAreaView>
  );
};

export default TreeSelect;
