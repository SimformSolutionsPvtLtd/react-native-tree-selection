import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * Tree data types.
 */

interface GenericTreeDataType {
  [key: string]:
    | TreeDataTypes[]
    | string
    | number
    | boolean
    | undefined
    | TreeDataTypes;
}

export interface TreeDataTypes extends GenericTreeDataType {
  isExpanded?: boolean;
  isSelected?: boolean;
  parent?: TreeDataTypes;
}

/**
 * Tree data prop types.
 */
export type TreeSelectTypes = {
  treeData?: TreeDataTypes[];
  childField?: string;
  titleField?: string;
  renderDownArrowComponent?: JSX.Element;
  renderRightArrowComponent?: JSX.Element;
  renderCheckboxComponent?: JSX.Element;
  renderUnCheckboxComponent?: JSX.Element;
  autoSelectParents?: boolean;
  autoSelectChildren?: boolean;
  autoExpandable?: boolean;
  onPressParent?: (item: TreeDataTypes) => void;
  onPressChild?: (item: TreeDataTypes) => void;
  onCheckBox?: (item: TreeDataTypes[]) => void;
  containerStyles?: StyleProp<ViewStyle>;
  leftIconStyles?: StyleProp<ImageStyle>;
  rightIconStyles?: StyleProp<ImageStyle>;
  parentContainerStyles?: StyleProp<ViewStyle>;
  parentTextStyles?: StyleProp<TextStyle>;
  childContainerStyles?: StyleProp<ViewStyle>;
  childTextStyles?: StyleProp<TextStyle>;
};
