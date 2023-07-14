import React from 'react';
import { SafeAreaView } from 'react-native';
import { TreeDataTypes, TreeSelect } from 'react-native-tree-selection';
import { StaticData } from './constants/StaticData';
import { styles } from './theme';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

export default App;
