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
  treeData,
  onPressParent = (_value: {}) => {},
  onPressChild = (_value: {}) => {},
  onCheckBox = ([]) => {},
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
  titleField = 'title',
  childField = 'data',
  renderDownArrowComponent,
  renderRightArrowComponent,
  renderCheckboxComponent,
  renderUnCheckboxComponent,
}: TreeSelectTypes) => {
  const [refresh, setRefresh] = useState(false);

  const [listData, setListData] = useState<TreeDataTypes[]>(
    cloneDeep(treeData ?? StaticData)
  );

  useEffect(() => {
    treeData && setListData(cloneDeep(treeData));
  }, [treeData]);

  useEffect(() => {
    childField === titleField && console.warn(Strings.samePropsError);
  }, [childField, titleField]);

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
      item[childField] &&
      typeof item[childField] === 'object' &&
      item[childField] !== null
    ) {
      (item[childField] as Array<TreeDataTypes>)?.map((child: TreeDataTypes) =>
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
      item[childField] &&
      typeof item[childField] === 'object' &&
      item[childField] !== null
    ) {
      (item[childField] as Array<TreeDataTypes>)?.map((child: TreeDataTypes) =>
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
    if (((item?.[childField] as Array<TreeDataTypes>) ?? [])?.length !== 0) {
      const check = (item[childField] as Array<TreeDataTypes>)?.filter(
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
  const selectChildrenItems = (data: TreeDataTypes[]) => {
    data?.map((item: TreeDataTypes) => {
      if (item.isSelected) {
        selectItem.push(item);
      }
      typeof item?.[childField] !== 'string' &&
        item?.[childField] !== null &&
        selectChildrenItems((item?.[childField] as Array<TreeDataTypes>) ?? []);
    });
  };

  /**
   * showChildren called when you click on any @string key.
   *
   * It will manipulate the @boolean isExpanded key.
   */
  const showChildren = (item: TreeDataTypes) => {
    item.isExpanded = !item?.isExpanded;
    onPressParent(item);
    reload();
  };

  const onPressCheckbox = (item: TreeDataTypes) => {
    if (!item?.isSelected && autoExpandable)
      item.isExpanded = !item?.isSelected;
    !item?.isSelected ? onSelect(item) : onUnSelect(item);
    onCheckBox(selectItem);
  };

  const renderIcon = (status: boolean) => {
    if (status) {
      if (React.isValidElement(renderCheckboxComponent)) {
        return renderCheckboxComponent;
      } else {
        return (
          <Image
            source={Icons.checkboxChecked}
            style={[styles.iconView, leftIconStyles]}
          />
        );
      }
    } else {
      if (React.isValidElement(renderUnCheckboxComponent)) {
        return renderUnCheckboxComponent;
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
      if (React.isValidElement(renderDownArrowComponent)) {
        return renderDownArrowComponent;
      } else {
        return (
          <Image
            source={Icons.open}
            style={[styles.iconView, rightIconStyles]}
          />
        );
      }
    } else {
      if (React.isValidElement(renderRightArrowComponent)) {
        return renderRightArrowComponent;
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
        {item[titleField] &&
          !(item[titleField] as 'string') &&
          console.error(Strings.textFieldTypeIssue)}
        {/**
         * Part I.
         */}
        {item[titleField] &&
          typeof item[titleField] === 'string' &&
          item[childField] &&
          (item[childField] as Array<TreeDataTypes>)?.length > 0 && (
            <View style={styles.renderContainer}>
              <TouchableOpacity
                testID={`${item[titleField]}-parent`}
                onPress={() => showChildren(item)}
                style={parentContainerStyles ?? styles.parentStyles}>
                <>
                  <TouchableOpacity
                    testID={`${item[titleField]}-press`}
                    onPress={() => {
                      onPressCheckbox(item);
                    }}
                    style={styles.chevronContainer}>
                    {renderIcon(item?.isSelected)}
                  </TouchableOpacity>
                </>
                <Text style={[styles.text, parentTextStyles]}>
                  {item[titleField] as string}
                </Text>
                {typeof item[childField] === 'object' && (
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
        {item[titleField] &&
          typeof item[titleField] === 'string' &&
          ((item?.[childField] as Array<TreeDataTypes>) ?? [])?.length ===
            0 && (
            <TouchableOpacity
              testID={`${item[titleField]}-child`}
              style={[styles.childrenContainerStyles, childContainerStyles]}
              onPress={() => onPressChild(item)}>
              <TouchableOpacity
                onPress={() => {
                  onPressCheckbox(item);
                }}
                testID={`${item[titleField]}-press`}
                style={styles.chevronContainer}>
                {renderIcon(item?.isSelected)}
              </TouchableOpacity>
              <Text style={[styles.text, childTextStyles]}>
                {item[titleField] as string}
              </Text>
            </TouchableOpacity>
          )}
        {/**
         * Part III.
         */}
        {item[childField] !== null && item?.isExpanded && (
          <View style={styles.innerContainer}>
            <FlatList
              data={item[childField] as Array<TreeDataTypes>}
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
