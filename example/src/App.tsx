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
        data={StaticData}
        onParentPress={(item: TreeDataTypes) => {
          console.log('onPressParent', item);
        }}
        onChildPress={(item: TreeDataTypes) => {
          console.log('onPressChild', item);
        }}
        onCheckBoxPress={(item: TreeDataTypes[]) => {
          console.log('onCheckBox', item);
        }}
      />
    </View>
  );
};

export default App;
