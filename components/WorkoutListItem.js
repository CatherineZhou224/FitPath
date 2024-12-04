import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { deleteWorkoutThunk } from '../features/workoutsSlice';

function WorkoutListItem(props) {
  const dispatch = useDispatch();
  const { item, navigation } = props;

  return (
    <View style={styles.listItemContainer}>
      <TouchableOpacity 
        style={styles.li1}
        onPress={() => {
          navigation.navigate('HomeDetailScreen', { 
            item: item 
          });
        }}  
      >
        <Text style={styles.listItemText}>
          {item.firstName} {item.lastName}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.li3}
        onPress={() => {
          dispatch(deleteWorkoutThunk(item.key));
        }}  
      >
        <Icon 
          name="trash"
          type="font-awesome"
          color="black"
          size={25}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '5%',
  },
  li1: {
    flex: 0.8, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '3%'
  },
  li3: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  listItemText: {
    fontSize: 20,
  },
});

export default WorkoutListItem;
