import { StyleSheet } from 'react-native';
import { Colors } from '../../theme';
import { fontScale, scale, verticalScale } from '../../helpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  text: {
    color: Colors.white,
    fontSize: fontScale(18),
  },
  innerText: {
    color: Colors.white,
    fontSize: fontScale(15),
    alignSelf: 'center',
  },
  seperator: {
    height: verticalScale(0.5),
  },
  parentStyles: {
    backgroundColor: Colors.itemColor,
    marginTop: verticalScale(5),
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(15),
    borderRadius: scale(8),
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderWidth: scale(2),
    borderColor: Colors.black,
  },
  innerContainer: {
    marginLeft: scale(20),
    overflow: 'hidden',
  },
  containerStyle: {
    paddingVertical: verticalScale(50),
  },
});

export default styles;
