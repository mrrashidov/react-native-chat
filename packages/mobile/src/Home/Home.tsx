import React from "react";
import {View, Button } from "react-native";
import {StatusBar} from "expo-status-bar";
export default function Home({navigation}: any) {
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <StatusBar style="auto" backgroundColor="transparent"/>
            <Button
                title="Go to Chat Jon"
                onPress={() => {
                    navigation.navigate("Contacts", {
                        id: 1,
                    })
                }}
            />

            <Button
                title="Go to Chat Jane"
                onPress={() => {
                    navigation.navigate("Contacts", {
                        id: 2,
                    })
                }}
            />
        </View>
    );
}
