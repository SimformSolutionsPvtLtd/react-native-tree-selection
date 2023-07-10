import { cloneDeep, isEmpty, isNull, isObject, isString } from 'lodash';
import { useState } from 'react';
import { StaticData } from '../../constants';
import type { TreeDataTypes, TreeSelectHookTypes } from './types';

let selectItem: TreeDataTypes[] = [];

const useTreeSelect = ({
  data,
  onCheckBoxPress,
  onParentPress,
  autoSelectParents,
  autoSelectChildren,
  childKey,
  autoExpandable,
}: TreeSelectHookTypes) => {
  const [refresh, setRefresh] = useState(false);

  const [listData, setListData] = useState<TreeDataTypes[]>(
    cloneDeep(data ?? StaticData)
  );

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

  return {
    selectAll,
    onPressCheckbox,
    showChildren,
    setListData,
    listData,
    refresh,
  };
};

export default useTreeSelect;
