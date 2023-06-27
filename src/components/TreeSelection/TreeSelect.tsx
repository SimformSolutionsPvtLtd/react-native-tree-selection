import {
  cloneDeep,
  isArray,
  isEmpty,
  isEqual,
  isNull,
  isObject,
  isString,
  isUndefined,
} from 'lodash';
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
import type { CustomImageProps, TreeDataTypes, TreeSelectTypes } from './types';

let selectItem: TreeDataTypes[] = [];

export const CustomImage = ({ source, style }: CustomImageProps) => {
  return <Image source={source} style={[styles.iconView, style]} />;
};

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
    isEqual(childKey, titleKey) && console.warn(Strings.samePropsError);
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
      isObject(item[childKey]) &&
      !isNull(item[childKey])
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
      isObject(item[childKey]) &&
      !isNull(item[childKey])
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
    if ((!isEmpty(item?.[childKey]) || item?.[childKey]) ?? [].length === 0) {
      const check = (item[childKey] as Array<TreeDataTypes>)?.filter(
        (child: TreeDataTypes) => !child?.isSelected
      );
      item.isSelected = isEmpty(check);
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
      !isString(item?.[childKey]) &&
        !isNull(item[childKey]) &&
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
          <CustomImage source={Icons.checkboxChecked} style={leftIconStyles} />
        );
      }
    } else {
      if (React.isValidElement(renderUnSelect)) {
        return renderUnSelect;
      } else {
        return (
          <CustomImage
            source={Icons.checkboxUnchecked}
            style={leftIconStyles}
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
        return <CustomImage source={Icons.open} style={rightIconStyles} />;
      }
    } else {
      if (React.isValidElement(renderArrowClosed)) {
        return renderArrowClosed;
      } else {
        return <CustomImage source={Icons.close} style={rightIconStyles} />;
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
    if (isUndefined(item?.isExpanded)) {
      item.isExpanded = false;
    }

    if (isUndefined(item?.isSelected)) {
      item.isSelected = false;
    }

    return (
      <>
        {/**
         * If titleField is not an string value then throw error
         */}
        {item[titleKey] &&
          isString(!item[titleKey]) &&
          console.error(Strings.textFieldTypeIssue)}
        {/**
         * Part I.
         */}
        {item[titleKey] &&
          isString(item[titleKey]) &&
          item[childKey] &&
          isArray(item[childKey]) &&
          !isEmpty(item[childKey]) && (
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
                {isObject(item[childKey]) && (
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
          isString(item[titleKey]) &&
          isEmpty(item?.[childKey]) && (
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
        {!isNull(item[childKey]) && item?.isExpanded && (
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
