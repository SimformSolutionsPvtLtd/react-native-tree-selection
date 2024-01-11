import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { TreeDataTypes, TreeSelect } from 'react-native-tree-selection';
import { StaticData } from './constants/StaticData';
import { styles } from './theme';
import { isArray, isEmpty } from 'lodash';

const childKey = 'data';

const App = () => {
  const customRenderItem = (item: TreeDataTypes):JSX.Element => {
    console.log('customRenderItem', item);
    const hasChildren = isArray(item?.[childKey]) && !isEmpty(item[childKey]);
    return(
      <View>
        {hasChildren ?
          <Text>Custom Parent Render: {item.title}</Text> :
          <Text>Custom Child Render: {item.title}</Text>
        }
      </View>
    )
  };

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
        renderItem={customRenderItem}
      />
    </SafeAreaView>
  );
};

export default App;
