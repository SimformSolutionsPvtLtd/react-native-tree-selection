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
  data?: TreeDataTypes[];
  childKey?: string;
  titleKey?: string;
  renderArrowOpen?: JSX.Element;
  renderArrowClosed?: JSX.Element;
  renderSelect?: JSX.Element;
  renderUnSelect?: JSX.Element;
  autoSelectParents?: boolean;
  autoSelectChildren?: boolean;
  autoExpandable?: boolean;
  onParentPress?: (item: TreeDataTypes) => void;
  onChildPress?: (item: TreeDataTypes) => void;
  onCheckBoxPress?: (item: TreeDataTypes[]) => void;
  containerStyles?: StyleProp<ViewStyle>;
  leftIconStyles?: StyleProp<ImageStyle>;
  rightIconStyles?: StyleProp<ImageStyle>;
  parentContainerStyles?: StyleProp<ViewStyle>;
  parentTextStyles?: StyleProp<TextStyle>;
  childContainerStyles?: StyleProp<ViewStyle>;
  childTextStyles?: StyleProp<TextStyle>;
};
