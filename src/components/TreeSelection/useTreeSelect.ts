import { cloneDeep, isNull, isObject } from 'lodash';
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
   * This @onSelectOrUnselect function will call when clicked on checkbox or call when checked checkbox clicked again.
   */
  const onSelectOrUnselect = (item: TreeDataTypes, isSelect: boolean) => {
    item.isSelected = isSelect;
    selectAll(item);
    if (
      autoSelectChildren &&
      item[childKey] &&
      isObject(item[childKey]) &&
      !isNull(item[childKey])
    ) {
      (item[childKey] as Array<TreeDataTypes>)?.forEach(
        (child: TreeDataTypes) => onSelectOrUnselect(child, isSelect)
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
    const children = (item?.[childKey] as Array<TreeDataTypes>) ?? [];
    if (children?.length > 0) {
      const check = (item[childKey] as Array<TreeDataTypes>).filter(
        (child: TreeDataTypes) => !child?.isSelected
      );
      item.isSelected = check.length === 0;
    }
    if (item.parent) {
      selectParentItems(item.parent);
    }
    reload();
  };

  /**
   * This @selectChildrenItems function will call when children's value update and reflected in UI.
   */
  const selectChildrenItems = (childData: TreeDataTypes[]) => {
    childData.forEach((item: TreeDataTypes) => {
      if (item.isSelected) {
        selectItem.push(item);
      }
      if (Array.isArray(item[childKey])) {
        selectChildrenItems(item[childKey] as Array<TreeDataTypes>);
      }
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
    if (!item?.isSelected && autoExpandable) {
      item.isExpanded = !item?.isSelected;
    }
    if (!item?.isSelected) {
      onSelectOrUnselect(item, true);
    } else {
      onSelectOrUnselect(item, false);
    }
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
