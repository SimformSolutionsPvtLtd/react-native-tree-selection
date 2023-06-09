import React from 'react';
import { View } from 'react-native';
import {
  StaticData,
  TreeDataTypes,
  TreeSelect,
} from 'react-native-tree-selection';
import { styles } from './theme';

const App = () => {
  return (
    <View style={styles.container}>
      <TreeSelect
        treeData={StaticData}
        onPressParent={(item: TreeDataTypes) => {
          console.log('onPressParent', item);
        }}
        onPressChild={(item: TreeDataTypes) => {
          console.log('onPressChild', item);
        }}
        onCheckBox={(item: TreeDataTypes[]) => {
          console.log('onCheckBox', item);
        }}
      />
    </View>
  );
};

export default App;
