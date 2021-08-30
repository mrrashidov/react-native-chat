import React, {useEffect, useRef, useState} from 'react';
import {Provider} from "react-redux";
import {store} from "./src/store";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {Home} from './src/Home'
import {Contacts, Messages} from "./src/Chat";
import {ContactsHeader, MessagesHeader} from "./src/Chat/components/Header";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import {Platform} from "react-native";
import {sendDevice} from "./src/store/chatModule/api";

const Stack = createStackNavigator();

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;

    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function App() {

    const [expoPushToken, setExpoPushToken] = useState<string|undefined>('');
    const [notification, setNotification] = useState<boolean|object>(false);

    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
					sendDevice({ token: token }).then(() => setExpoPushToken(token))
				});
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => setNotification(notification));
        responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => setNotification(notification));
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={Home}/>
                    <Stack.Screen name="Contacts" component={Contacts} options={ContactsHeader}/>
                    <Stack.Screen name="Messages" component={Messages} options={MessagesHeader}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
