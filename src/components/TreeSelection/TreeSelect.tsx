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
import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icons } from '../../assets';
import { Strings } from '../../constants';
import styles from './styles';
import type {
  ChildItemTypes,
  CustomImageProps,
  ParentItemTypes,
  TreeDataTypes,
  TreeSelectTypes,
} from './types';
import useTreeSelect from './useTreeSelect';

const CustomImage = ({ source, style }: CustomImageProps) => {
  return <Image source={source} style={[styles.iconView, style]} />;
};

const ParentItem = ({
  item,
  parentContainerStyles,
  parentTextStyles,
  onPressCheckbox,
  showChildren,
  renderIcon,
  renderOpenCloseIcon,
  titleKey,
  childKey,
}: ParentItemTypes) => (
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
          {renderOpenCloseIcon(item?.isExpanded ?? false)}
        </View>
      )}
    </TouchableOpacity>
  </View>
);

const ChildItem = ({
  item,
  childContainerStyles,
  childTextStyles,
  onPressCheckbox,
  titleKey,
  onChildPress,
  renderIcon,
}: ChildItemTypes) => (
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
);

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
  const { listData, setListData, refresh, onPressCheckbox, showChildren } =
    useTreeSelect({
      data,
      onCheckBoxPress,
      autoSelectParents,
      autoSelectChildren,
      childKey,
      autoExpandable,
      onParentPress,
    });

  useEffect(() => {
    data && setListData(cloneDeep(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    isEqual(childKey, titleKey) && console.warn(Strings.samePropsError);
  }, [childKey, titleKey]);

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
         * Part I.
         */}
        {item[titleKey] &&
          isString(item[titleKey]) &&
          item[childKey] &&
          isArray(item[childKey]) &&
          !isEmpty(item[childKey]) && (
            <ParentItem
              item={item}
              parentContainerStyles={parentContainerStyles}
              parentTextStyles={parentTextStyles}
              onPressCheckbox={onPressCheckbox}
              showChildren={showChildren}
              renderIcon={renderIcon}
              renderOpenCloseIcon={renderOpenCloseIcon}
              titleKey={titleKey}
              childKey={childKey}
            />
          )}
        {/**
         * Part II.
         */}
        {item[titleKey] &&
          isString(item[titleKey]) &&
          isEmpty(item?.[childKey]) && (
            <ChildItem
              item={item}
              childContainerStyles={childContainerStyles}
              childTextStyles={childTextStyles}
              onPressCheckbox={onPressCheckbox}
              titleKey={titleKey}
              onChildPress={onChildPress}
              renderIcon={renderIcon}
            />
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
