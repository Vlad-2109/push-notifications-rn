import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, Platform } from 'react-native';
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

const sendPushNotification = async (expoPushToken: string) => {
	const message = {
		to: expoPushToken,
		sound: 'default',
		title: 'Original Title',
		body: 'And here is the body!',
		data: { someData: 'goes here' },
	};

	await fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Accept-encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(message),
	});
};

const handleRegistrationError = (errorMessage: string) => {
	alert(errorMessage);
	throw new Error(errorMessage);
};

const registerForPushNotificationsAsync = async () => {
	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;
	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}
	if (finalStatus !== 'granted') {
		handleRegistrationError(
			'Permission not granted to get push token for push notification!',
		);
		return;
	}
	const projectId =
		Constants?.expoConfig?.extra?.eas?.projectId ??
		Constants?.easConfig?.projectId;
	if (!projectId) {
		handleRegistrationError('Project ID not found');
	}
	try {
		const pushTokenString = (
			await Notifications.getExpoPushTokenAsync({
				projectId,
			})
		).data;
		console.log(pushTokenString);
		return pushTokenString;
	} catch (e: unknown) {
		handleRegistrationError(`${e}`);
	}
};

export default function RootLayout() {
	const [expoPushToken, setExpoPushToken] = useState<string>('');

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then((token) => setExpoPushToken(token ?? ''))
			.catch((error: any) => setExpoPushToken(`${error}`));
	}, []);

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
			<Stack
				screenOptions={{
					headerRight: () => (
						<Button
							title="Send push notification"
							onPress={() => sendPushNotification(expoPushToken)}
						/>
					),
				}}
			/>
		</SafeAreaProvider>
	);
}
