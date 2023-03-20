export type SubcatagoriesAlternatData = {
  length: number;
  id: number;
  value: string;
};

export type RecursiveSubCatagory = {
  subcategory: TreeDataTypes | SubcatagoriesAlternatData;
};

export type TreeDataTypes = {
  treeData: {
    isExpandable?: boolean;
    category_id: number;
    category_name: string;
    subcategory: RecursiveSubCatagory;
  };
  length: number;
};

export type SubcategoryDataTypes = {
  length: number;
  isExpanded: boolean;
  subcategory: TreeDataTypes | SubcatagoriesAlternatData;
};

export type IItems = {
  category_name: string;
  category_id: string;
  isExpanded?: boolean;
  value: string;
  subcategory: SubcategoryDataTypes;
};

export type ItemTypes = {
  item: IItems;
};

export type TreeSelectTypes = {
  treeData: Array<Object>;
  parentOnPress: ([]) => void;
  childOnPress: ({}) => void;
};
