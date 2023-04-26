import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import TreeSelect from '../TreeSelect';
import { StaticData } from '../../../constants';
import { Image } from 'react-native';
import { Icons } from '../../../assets';

jest.useFakeTimers();

describe('Tree View component', () => {
  it('Match Snapshot', () => {
    const { toJSON } = render(<TreeSelect treeData={StaticData} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it('Match without data Snapshot', () => {
    const { toJSON } = render(
      <TreeSelect onPressParent={() => {}} onPressChild={() => {}} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('Match Snapshot dummy isExpanded data else path', () => {
    const { toJSON } = render(
      <TreeSelect
        treeData={StaticData}
        onPressParent={() => {}}
        onPressChild={() => {}}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('Match without onPress Snapshot', () => {
    const { toJSON, getByTestId } = render(
      <TreeSelect treeData={StaticData} />
    );
    const buttonGlobal = getByTestId('Electronics-parent');
    fireEvent.press(buttonGlobal);
    const buttonParent = getByTestId('Mobile-parent');
    fireEvent.press(buttonParent);
    const buttonInnerParent = getByTestId('Apple-parent');
    fireEvent.press(buttonInnerParent);
    expect(toJSON()).toMatchSnapshot();
  });
  it('Match Snapshot When parent styles given', () => {
    const { toJSON } = render(
      <TreeSelect parentContainerStyles={{ alignItems: 'center' }} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('Match SnapshotLeft Icon valid JSX', () => {
    const { toJSON } = render(
      <TreeSelect
        renderDownArrowComponent={<Image source={Icons.open} />}
        treeData={StaticData}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('resolves Parent onPress ', () => {
    const fn = jest.fn();
    const { toJSON, getByTestId } = render(
      <TreeSelect onPressParent={fn} treeData={StaticData} />
    );
    const buttonParent = getByTestId('Electronics-parent');
    fireEvent.press(buttonParent);
    expect(fn).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });
  it('resolves Checkbox onPress ', () => {
    const fn = jest.fn();
    const { toJSON, getByTestId } = render(
      <TreeSelect
        onCheckBox={fn}
        treeData={StaticData}
        autoSelectParents={false}
      />
    );
    const buttonParent = getByTestId('Electronics-press');
    fireEvent.press(buttonParent);
    StaticData[0].isSelected = true;
    fireEvent.press(buttonParent);
    StaticData[0].isSelected = false;
    expect(fn).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('resolves Parent onPress to expand and unexpand ', () => {
    const fn = jest.fn();
    const { toJSON, getByTestId } = render(
      <TreeSelect onPressParent={fn} treeData={StaticData} />
    );
    const buttonParent = getByTestId('Electronics-parent');
    fireEvent.press(buttonParent);
    const buttonParentUnExapnd = getByTestId('Electronics-parent');
    fireEvent.press(buttonParentUnExapnd);
    expect(fn).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('resolves Child onPress ', () => {
    const fn = jest.fn();
    const childValue = 'data';
    const { toJSON, getByTestId } = render(
      <TreeSelect
        onPressParent={fn}
        treeData={StaticData}
        childField={childValue}
      />
    );
    const buttonGlobal = getByTestId('Electronics-parent');
    fireEvent.press(buttonGlobal);
    const buttonParent = getByTestId('Fashion-parent');
    fireEvent.press(buttonParent);
    const buttonInnerParent = getByTestId('Watches-child');
    fireEvent.press(buttonInnerParent);
    const buttonInnerParentChecked = getByTestId('Watches-press');
    fireEvent.press(buttonInnerParentChecked);
    if (
      StaticData[0][childValue] &&
      StaticData[0][childValue][0] &&
      StaticData[0][childValue][0][childValue] &&
      StaticData[0][childValue][0][childValue][0].isSelected
    ) {
      StaticData[0][childValue][0][childValue][0].isSelected = true;
    }

    fireEvent.press(buttonInnerParentChecked);
    const checkboxParent = getByTestId('Fashion-press');
    fireEvent.press(checkboxParent);
    expect(fn).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });
});
