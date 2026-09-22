import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
	const handleScheduleNotification = () => {
		Notifications.scheduleNotificationAsync({
			content: {
				title: 'My first local notification',
				body: 'This is a body of notification',
				data: {
					userName: 'John Doe',
				},
			},
			trigger: {
				type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
				seconds: 5,
			},
		});
	};

	return (
		<SafeAreaView style={styles.container} edges={['left', 'right']}>
			<Stack.Screen
				options={{
					title: 'Home',
				}}
			/>
			<Button
				title="Schedule Notification"
				onPress={handleScheduleNotification}
			/>
		</SafeAreaView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
	},
});
