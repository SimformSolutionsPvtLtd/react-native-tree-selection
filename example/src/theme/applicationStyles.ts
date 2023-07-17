import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from './Metrics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    marginTop: verticalScale(50),
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
});

export default styles;
