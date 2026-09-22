import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AllPlacesScreen = () => {
	return (
		<SafeAreaView style={styles.container} edges={['left', 'right']}>
			<Stack.Screen
				options={{
					title: 'Home',
				}}
			/>
		</SafeAreaView>
	);
};

export default AllPlacesScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
