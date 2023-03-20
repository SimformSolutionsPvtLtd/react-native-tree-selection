import React from 'react';
import { TreeSelect } from 'react-native-tree-selection';

/**
 * This is Dummy data for testing
 */
export const treeData = [
  {
    category_id: '1',
    category_name: 'Animals',
    subcategory: [
      {
        category_id: '2',
        category_name: 'Herbivorus',
        subcategory: [
          {
            category_id: '3',
            category_name: 'Grass Eating',
            subcategory: [
              { id: 1, value: 'Deer' },
              { id: 2, value: 'Elephant' },
              { id: 3, value: 'Cow' },
              { id: 4, value: 'Zebra' },
            ],
          },
        ],
      },
      {
        category_id: '4',
        category_name: 'Carnivorus',
        subcategory: [{
          category_id: '5',
          category_name: 'Prey',
          subcategory: [
            { id: 1, value: 'Lion' },
            { id: 2, value: 'Tiger' },
            { id: 3, value: 'Cheetah' },
            { id: 4, value: 'Bat' },
          ],
        }],
      },
    ],
  },
];


const App = () => {
  return <TreeSelect treeData={treeData} childOnPress={() => {}} parentOnPress={() => {}} />;
};

export default App;
