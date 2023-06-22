import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icons } from '../../assets';
import { StaticData, Strings } from '../../constants';
import styles from './styles';
import type { TreeDataTypes, TreeSelectTypes } from './types';

let selectItem: TreeDataTypes[] = [];

const TreeSelect = ({
  data,
  onParentPress = (_value: {}) => {},
  onChildPress = (_value: {}) => {},
  onCheckBoxPress = ([]) => {},
  leftIconStyles,
  rightIconStyles,
  parentContainerStyles,
  childContainerStyles,
  parentTextStyles,
  childTextStyles,
  containerStyles,
  autoSelectParents = true,
  autoSelectChildren = true,
  autoExpandable = false,
  titleKey = 'title',
  childKey = 'data',
  renderArrowOpen,
  renderArrowClosed,
  renderSelect,
  renderUnSelect,
}: TreeSelectTypes) => {
  const [refresh, setRefresh] = useState(false);

  const [listData, setListData] = useState<TreeDataTypes[]>(
    cloneDeep(data ?? StaticData)
  );

  useEffect(() => {
    data && setListData(cloneDeep(data));
  }, [data]);

  useEffect(() => {
    childKey === titleKey && console.warn(Strings.samePropsError);
  }, [childKey, titleKey]);

  /**
   * This @selectAll function will call when selectAll Parents items.
   */
  const selectAll = (item: TreeDataTypes) => {
    // Select all parent items.
    if (autoSelectParents && item?.parent) {
      selectParentItems(item?.parent);
    }
  };

  /**
   * This @onSelect function will call when clicked on checkbox.
   */
  const onSelect = (item: TreeDataTypes) => {
    item.isSelected = true;
    selectAll(item);
    if (
      autoSelectChildren &&
      item[childKey] &&
      typeof item[childKey] === 'object' &&
      item[childKey] !== null
    ) {
      (item[childKey] as Array<TreeDataTypes>)?.map((child: TreeDataTypes) =>
        onSelect(child)
      );
    }
    reload();
  };

  /**
   * This @onUnSelect function will call when checked again checkbox.
   */
  const onUnSelect = (item: TreeDataTypes) => {
    item.isSelected = false;
    selectAll(item);
    if (
      autoSelectChildren &&
      item[childKey] &&
      typeof item[childKey] === 'object' &&
      item[childKey] !== null
    ) {
      (item[childKey] as Array<TreeDataTypes>)?.map((child: TreeDataTypes) =>
        onUnSelect(child)
      );
    }
    reload();
  };

  /**
   * This @reload function will call model value update with isExpanded & isSelected value.
   */
  const reload = () => {
    setRefresh(!refresh);
    selectItem = [];
    selectChildrenItems(listData);
  };

  /**
   * This @selectParentItems function will call when checkbox value is change`s and its update that parent item and reflected in UI.
   */
  const selectParentItems = (item: TreeDataTypes) => {
    if (((item?.[childKey] as Array<TreeDataTypes>) ?? [])?.length !== 0) {
      const check = (item[childKey] as Array<TreeDataTypes>)?.filter(
        (child: TreeDataTypes) => !child?.isSelected
      );
      item.isSelected = check?.length === 0;
    }
    item?.parent && selectParentItems(item?.parent);
    reload();
  };

  /**
   * This @selectChildrenItems function will call when children's value update and reflected in UI.
   */
  const selectChildrenItems = (childData: TreeDataTypes[]) => {
    childData?.map((item: TreeDataTypes) => {
      if (item.isSelected) {
        selectItem.push(item);
      }
      typeof item?.[childKey] !== 'string' &&
        item?.[childKey] !== null &&
        selectChildrenItems((item?.[childKey] as Array<TreeDataTypes>) ?? []);
    });
  };

  /**
   * showChildren called when you click on any @string key.
   *
   * It will manipulate the @boolean isExpanded key.
   */
  const showChildren = (item: TreeDataTypes) => {
    item.isExpanded = !item?.isExpanded;
    onParentPress(item);
    reload();
  };

  const onPressCheckbox = (item: TreeDataTypes) => {
    if (!item?.isSelected && autoExpandable)
      item.isExpanded = !item?.isSelected;
    !item?.isSelected ? onSelect(item) : onUnSelect(item);
    onCheckBoxPress(selectItem);
  };

  const renderIcon = (status: boolean) => {
    if (status) {
      if (React.isValidElement(renderSelect)) {
        return renderSelect;
      } else {
        return (
          <Image
            source={Icons.checkboxChecked}
            style={[styles.iconView, leftIconStyles]}
          />
        );
      }
    } else {
      if (React.isValidElement(renderUnSelect)) {
        return renderUnSelect;
      } else {
        return (
          <Image
            source={Icons.checkboxUnchecked}
            style={[styles.iconView, leftIconStyles]}
          />
        );
      }
    }
  };

  const renderOpenCloseIcon = (status: boolean) => {
    if (status) {
      if (React.isValidElement(renderArrowOpen)) {
        return renderArrowOpen;
      } else {
        return (
          <Image
            source={Icons.open}
            style={[styles.iconView, rightIconStyles]}
          />
        );
      }
    } else {
      if (React.isValidElement(renderArrowClosed)) {
        return renderArrowClosed;
      } else {
        return (
          <Image
            source={Icons.close}
            style={[styles.iconView, rightIconStyles]}
          />
        );
      }
    }
  };

  /**
   * This is Render tree @RecursiveFunction which calls itself if found any children.
   * @Flatlist is used to re-render the tree.
   * This @Flatlist is divided into 3 Parts:
   *
   *    Part I - In this part all the elements are rendered which have the childrens.
   *             All The styling for the parent @Items will goes here.
   *
   *    Part II - In this part all the elements are rendered which does not have the childrens.
   *             All The styling for the leaf children @Items will goes here.
   *
   *    Part III - If any @Item having children's will call the @RecursiveFunction and re-render flatlist.
   *               All the styling between @children and @parent goes here.
   */
  const renderTree = ({ item }: { item: TreeDataTypes }) => {
    if (!item?.isExpanded) {
      item.isExpanded = false;
    }
    if (!item?.isSelected) {
      item.isSelected = false;
    }

    return (
      <>
        {/**
         * If titleField is not an string value then throw error
         */}
        {item[titleKey] &&
          !(item[titleKey] as 'string') &&
          console.error(Strings.textFieldTypeIssue)}
        {/**
         * Part I.
         */}
        {item[titleKey] &&
          typeof item[titleKey] === 'string' &&
          item[childKey] &&
          (item[childKey] as Array<TreeDataTypes>)?.length > 0 && (
            <View style={styles.renderContainer}>
              <TouchableOpacity
                testID={`${item[titleKey]}-parent`}
                onPress={() => showChildren(item)}
                style={parentContainerStyles ?? styles.parentStyles}>
                <>
                  <TouchableOpacity
                    testID={`${item[titleKey]}-press`}
                    onPress={() => {
                      onPressCheckbox(item);
                    }}
                    style={styles.chevronContainer}>
                    {renderIcon(item?.isSelected)}
                  </TouchableOpacity>
                </>
                <Text style={[styles.text, parentTextStyles]}>
                  {item[titleKey] as string}
                </Text>
                {typeof item[childKey] === 'object' && (
                  <View style={styles.chevronContainer}>
                    {renderOpenCloseIcon(item?.isExpanded)}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        {/**
         * Part II.
         */}
        {item[titleKey] &&
          typeof item[titleKey] === 'string' &&
          ((item?.[childKey] as Array<TreeDataTypes>) ?? [])?.length === 0 && (
            <TouchableOpacity
              testID={`${item[titleKey]}-child`}
              style={[styles.childrenContainerStyles, childContainerStyles]}
              onPress={() => onChildPress(item)}>
              <TouchableOpacity
                onPress={() => {
                  onPressCheckbox(item);
                }}
                testID={`${item[titleKey]}-press`}
                style={styles.chevronContainer}>
                {renderIcon(item?.isSelected)}
              </TouchableOpacity>
              <Text style={[styles.text, childTextStyles]}>
                {item[titleKey] as string}
              </Text>
            </TouchableOpacity>
          )}
        {/**
         * Part III.
         */}
        {item[childKey] !== null && item?.isExpanded && (
          <View style={styles.innerContainer}>
            <FlatList
              data={item[childKey] as Array<TreeDataTypes>}
              renderItem={({ item: itemName }) => {
                if (!itemName?.parent) {
                  itemName.parent = item;
                }
                return renderTree({ item: itemName });
              }}
            />
          </View>
        )}
      </>
    );
  };

  /**
   * This is the return function which renders the JSX.
   */
  return (
    <SafeAreaView style={[styles.container, containerStyles]}>
      <FlatList
        data={listData}
        renderItem={renderTree}
        keyExtractor={(_item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        extraData={refresh}
      />
    </SafeAreaView>
  );
};

export default TreeSelect;
