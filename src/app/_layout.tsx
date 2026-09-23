import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {
	SafeAreaProvider,
	initialWindowMetrics,
} from 'react-native-safe-area-context';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: false,
		shouldSetBadge: false,
		shouldShowAlert: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export default function RootLayout() {
	useEffect(() => {
		const subscriptionNotificationReceived =
			Notifications.addNotificationReceivedListener((response) => {
				console.log('NOTIFICATION RECEIVED');
				console.log(response.request.content.data?.userName);
			});

		const subscriptionNotificationResponseReceived =
			Notifications.addNotificationResponseReceivedListener((response) => {
				console.log('NOTIFICATION RESPONSE RECEIVED');
				console.log(response.notification.request.content.data?.userName);
			});

		return () => {
			subscriptionNotificationReceived.remove();
			subscriptionNotificationResponseReceived.remove();
		};
	}, []);

	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<StatusBar style="dark" />
			<Stack />
		</SafeAreaProvider>
	);
}
