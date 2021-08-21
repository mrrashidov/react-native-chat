import React from 'react';
import { Image, TouchableOpacity, View } from "react-native";
import {chatRoot} from "../styles";
import { Feather as Icon } from "@expo/vector-icons";

export const ContactsHeader = () => {
    return {
        title: 'Chat',
        headerRight: ({route}: any) => (
            <Image
                style={chatRoot.image}
                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
            />
        ),
        headerStyle: chatRoot.headerStyle,
        headerTintColor: '#FAFAFA',
        headerTitleStyle: chatRoot.headerTitleStyle,
        cardStyle: chatRoot.cardStyle
    }
}

export const MessagesHeader = ({route}: any) => {
    return {
        title: `.. s Chat`,
        headerRight: () => (
            <View>
                <TouchableOpacity
                    onPress={() => console.log("menu Clicked")}
                    style={{ marginHorizontal: 5 }}
                >
                    <Icon
                        name="more-vertical"
                        size={26}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
        ),
        headerStyle: chatRoot.headerStyle,
        headerTintColor: '#FAFAFA',
        headerTitleStyle: chatRoot.headerTitleStyle,
        cardStyle: chatRoot.cardStyleGetMessage
    }
}