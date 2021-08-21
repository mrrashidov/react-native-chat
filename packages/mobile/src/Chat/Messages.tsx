import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from "../store";
import {fetchRoom} from "../store/chatModule/api";
import {ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View, Image} from "react-native";
import {chatMessage, chatTextarea} from "./styles";
import {Ionicons} from "@expo/vector-icons";
import Product from "./components/Product";
import {sendMessage} from "../store/chatModule/room";


export default function Messages({route}: any) {
    const dispatch = useDispatch()
    const {messages, loading} = useSelector((state: RootState) => state.room);

    const {userId, contactId, roomId} = route.params
    const flatList: any = useRef(null)
    const ws = useRef();
    const [isProductSelected, setIsProductSelected] = useState<boolean>(true)
    const [ isConnectionOpen, setConnectionOpen ] = useState(false);
    const [postText, setPostText] = useState('');

    const existsItem = [
        {id: 1, message: 'Is it still available?'},
        {id: 2, message: 'Can we meet?'},
        {id: 3, message: 'How is the condition?'}
    ]

    useEffect(() => {
        dispatch(fetchRoom({userId, contactId, roomId}))
    }, [roomId])

    useEffect(() => {
        // @ts-ignore
        ws.current = new WebSocket('ws://192.168.0.27:9000/echo');
        // @ts-ignore
        ws.current.onopen = () => {
            setConnectionOpen(true);
        };
        // @ts-ignore
        ws.current.onmessage = (ev) => {
            dispatch(sendMessage(JSON.parse(ev.data)))
        };
        // @ts-ignore
        ws.current.onclose = (ev) => {
            setConnectionOpen(false);
        };

        return () => {
            console.log('Cleaning up! 🧼');
            // @ts-ignore
            ws.current.close();
        };
    }, []);


    const EmptyListMessage = () => {
        return (
            <Text
                style={chatMessage.emptyContent}>
                No Data Found
            </Text>
        );
    };

    const sendBtn = (data = null) => {
        const payload = {
            roomId: roomId,
            senderId: userId,
            receiverId: contactId,
            message: data ? data : postText,
        }
        //@ts-ignore
        ws.current.send(JSON.stringify(payload))
        setPostText('')
    }

    const EmptyLayout = () => {
        return ( <Product/>)
    }
    const renderItem = ({item}: any) => (
        <View style={item.user.id === contactId ? chatMessage.itemContactId : chatMessage.itemUserId}>
            <View style={{flexDirection: 'row'}}>
                {item.user.id === contactId ?
                    <Image source={{uri: item.user.avatar}} style={chatMessage.image}/> : null}
                <View
                    style={item.user.id === contactId ? chatMessage.itemChildContactId : chatMessage.itemChildUserId}>
                    <View style={chatMessage.messageContent}>
                        <Text style={{fontSize: 13, color: '#FFF'}}>{item.text}</Text>
                        <Text style={chatMessage.textContent}> {new Date(item.createdAt).toLocaleTimeString()}</Text>
                    </View>
                </View>
            </View>
        </View>
    )

    const autoMessageItem = ({item}: any) => {
        return (
            <TouchableOpacity
                style={{
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 40,
                    borderColor: '#2196f3',
                    borderWidth: 2,
                    margin: 5
                }}
                onPress={() => {
                    sendBtn(item.message)
                }}>
                <Text style={{justifyContent: 'center', padding: 10, color: '#2196f3', fontWeight: 'bold'}}>
                    {item.message}
                </Text>
            </TouchableOpacity>
        )
    }
    if (loading) {
        return <ActivityIndicator size="large" style={{marginTop: 'auto', marginBottom: 'auto'}}/>;
    }
    return (

        <View style={{flex: 1}}>
            {isProductSelected ? (
                <><FlatList
                    ListEmptyComponent={EmptyListMessage}
                    ListHeaderComponent={Product}
                    renderItem={renderItem}
                    data={messages}
                    keyExtractor={item => item.id.toString()}
                    onContentSizeChange={() => flatList.current.scrollToEnd({animated: true})}
                    onLayout={() => flatList.current.scrollToEnd({animated: true})}
                    style={{margin: 5, paddingHorizontal: 9, width: '100%'}}
                    ref={flatList}
                    inverted={false}/>
                    <View>
                        {messages.length <= 0 ?
                            <View style={chatTextarea.header}>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    legacyImplementation={false}
                                    data={existsItem}
                                    renderItem={autoMessageItem}
                                    keyExtractor={(item) => item.id.toString()}/>
                            </View>
                            : null}
                        <View style={chatTextarea.box}>
                            <View style={{flex: 4}}>
                                <TextInput
                                    style={{height: 40, padding: 10}}
                                    value={postText}
                                    onChangeText={setPostText}
                                    placeholder="Type Here"/>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                    style={chatTextarea.button}
                                    onPress={() => sendBtn()}>
                                    <Ionicons name="send" size={24} color="#888"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View></>
            ): (<EmptyLayout />)}
        </View>
    )
}
