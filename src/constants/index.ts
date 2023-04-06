/**
 * This is Dummy data for testing
 */
export const dummyTreeData = [
  {
    category_id: '1',
    category_name: 'CARS',
    subcategory: [
      {
        category_id: '2',
        category_name: 'SPORTS',
        subcategory: [
          {
            category_id: '3',
            category_name: 'V12 ENGINE',
            subcategory: [
              {
                category_id: '4',
                category_name: 'BUGATI CHIRON',
                subcategory: [
                  { id: 1, value: 'Awsome' },
                  { id: 2, value: 'Wow' },
                  { id: 3, value: 'Fastest' },
                  { id: 4, value: 'Cool' },
                ],
              },
            ],
          },
          { id: 5, value: 'V6 ENGINE' },
          { id: 6, value: 'TURBO ENGINE' },
          { id: 7, value: 'V8 ENGINE' },
        ],
      },
      { id: 8, value: 'HATCH BACK' },
      { id: 9, value: 'SUV' },
      { id: 10, value: 'SIDAN' },
    ],
  },
  {
    category_id: '5',
    category_name: 'BIKE',
    subcategory: [
      { id: 11, value: 'Two Weeler' },
      { id: 12, value: 'Fast' },
      { id: 13, value: 'Small' },
      { id: 14, value: 'SPORTY' },
    ],
  },
];
