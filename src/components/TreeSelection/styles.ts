import { StyleSheet } from 'react-native';
import { Colors } from '../../theme';
import { fontScale, scale, verticalScale } from '../../helpers';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundColor,
  },
  text: {
    color: Colors.white,
    fontSize: fontScale(18),
  },
  parentStyles: {
    backgroundColor: Colors.itemColor,
    marginTop: verticalScale(5),
    paddingRight: scale(10),
    borderRadius: scale(8),
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingLeft: scale(20),
  },
  chevronContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  childrenContainerStyles: {
    backgroundColor: Colors.itemColor,
    paddingRight: scale(10),
    borderRadius: scale(8),
    marginTop: verticalScale(5),
    alignItems: 'center',
    flexDirection: 'row',
  },
  renderContainer: {
    alignItems: 'flex-start',
  },
  iconView: {
    height: fontScale(32),
    width: fontScale(32),
    tintColor: Colors.white,
  },
});

export default styles;
