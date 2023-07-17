import { StyleSheet } from 'react-native';
import { Colors, verticalScale, moderateScale, scale } from '../../theme';

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontSize: moderateScale(18),
  },
  containerStyle: {
    margin: moderateScale(20),
    marginBottom: verticalScale(10),
    alignItems: 'flex-start',
  },
  parentStyles: {
    backgroundColor: Colors.parentContainerColor,
    marginTop: verticalScale(5),
    paddingRight: scale(10),
    borderRadius: moderateScale(8),
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
    backgroundColor: Colors.parentContainerColor,
    paddingRight: scale(10),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(5),
    alignItems: 'center',
    flexDirection: 'row',
  },
  renderContainer: {
    alignItems: 'flex-start',
  },
  iconView: {
    height: moderateScale(32),
    width: moderateScale(32),
    tintColor: Colors.white,
  },
});

export default styles;
