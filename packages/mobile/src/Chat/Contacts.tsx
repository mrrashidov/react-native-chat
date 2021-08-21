import React, {useEffect, useState} from "react";
import {
    FlatList,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Image, ActivityIndicator
} from "react-native";
import {StatusBar} from "expo-status-bar";
import {chatItem, chatList, chatOnlineIcon, chatSearch} from "./styles";
import Svg, {Circle} from "react-native-svg";

import { useDispatch, useSelector } from 'react-redux';
import {RootState} from "../store";
import {fetchContacts} from "../store/chatModule/api";

export default function Contacts({navigation, route}: any) {
    const {id} = route.params

    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch()

    const { contacts, loading } = useSelector((state: RootState) => state.contacts);

    useEffect(() => {
       dispatch(fetchContacts(id))
    }, [id])


    if (loading) {
        return <ActivityIndicator size="large" style={{   marginTop: 'auto', marginBottom: 'auto'}} />;
    }
    const OnlineIcon = ({width, height, color}: any) => {
        return (
            <Svg height={height} width={width} viewBox="0 0 100 100" style={chatOnlineIcon.main}>
                <Circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2.5" fill={color}/>
            </Svg>
        )
    }


    const renderItem = ({item}: any) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Messages', {userId: id, contactId: item.user.id, roomId: item.id})}>
                <View style={chatItem.card}>
                    <View style={chatItem.profile}>
                        <View style={{position: 'relative'}}>
                            {item.user.status === 'online' ?
                                <OnlineIcon width={10} height={10} color='#44fc95'/> : false}
                            <Image style={chatItem.avatar} source={{uri: item.user.avatar}}/>
                        </View>
                        <View>
                            <Text style={chatItem.username}>{item.user.name}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text
                                    style={chatItem.message}>{
                                    item.message.length > 50 ?
                                        item.message.substr(0, 49) + ' ...' : item.message
                                }
                                </Text>
                                {
                                    item.unseen !== 0 ? <Text style={chatList.unSeen}> {item.unseen}</Text> : null
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }


    return (
        <View>
            <StatusBar backgroundColor="transparent"/>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <TextInput
                    style={chatSearch.searchButton}
                    placeholder="Search"
                    placeholderTextColor="#9e9ea3" value={searchText}
                    onChangeText={text => setSearchText(text)}
                />
            </TouchableWithoutFeedback>
            <FlatList
                style={chatList.messageBox}
                data={contacts}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}
