import React from 'react';
import { render } from '@testing-library/react-native';
import TreeSelect from '../TreeSelect';

jest.useFakeTimers();

describe('Tree View component', () => {
  it('Match Snapshot', () => {
    const { toJSON } = render(<TreeSelect treeData={[]} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
