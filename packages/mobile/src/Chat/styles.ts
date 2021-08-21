import { StyleSheet } from "react-native";

export const chatMessage = StyleSheet.create({
    header:{
        backgroundColor:'#fff'
    },
    itemContactId:{
        alignItems: 'flex-start', justifyContent: 'space-between'
    },
    itemUserId:{
        alignItems: 'flex-end', justifyContent: 'space-between'
    },
    image:{
        width: 25,
        height: 25,
        borderRadius: 25,
        marginTop: 12,
        marginLeft: 12,
        marginRight: 4
    },
    itemChildContactId:{
        borderBottomEndRadius: 15,
        borderTopEndRadius: 15,
        borderTopStartRadius: 8,
        backgroundColor: '#7c62f7',//7c62f7
        margin: 1
    },
    itemChildUserId:{
        borderTopStartRadius: 15,
        borderBottomStartRadius: 15,
        borderTopEndRadius: 8,
        backgroundColor: '#24c26b',
        margin: 1
    },
    messageContent:{marginLeft: 10, marginRight: 10, marginBottom: 5, marginTop: 5},
    textContent:{
        fontSize: 8,
        color: '#FFF',
        textAlign: 'right'
    },
    emptyContent:{
        padding: 10,
        fontSize: 18,
        textAlign: 'center',
    }
});

export const chatTextarea = StyleSheet.create({
    header:{
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    box:{
        flexDirection: 'row',
        width: 'auto',
        margin: 4,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        backgroundColor: '#fff'
    },
    button:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 1,
        paddingHorizontal: 10,
        paddingLeft: 20
    }
});

export const chatList = StyleSheet.create({
    messageBox: {
        marginLeft: 20,
        marginRight: 20,
    },
    unSeen:{
        fontSize: 10,
        fontWeight: 'bold',
        paddingLeft: 3,
        paddingRight: 5,
        paddingBottom: 1,
        paddingTop: 1,
        borderRadius: 10,
        backgroundColor: 'red',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export const chatItem = StyleSheet.create({
    profile: {
        flexDirection: "row",
    },
    card: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#FAFAFA",
        elevation: 1

    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10,
        borderWidth: 3, borderColor: '#FFF'
    },
    username: {fontWeight: "bold", fontSize: 14},
    message: {fontSize: 12, color: 'gray'}
});

export const chatOnlineIcon = StyleSheet.create({
    main: {
        position: "absolute",
        right:10,
        zIndex:99
    }
});

export const chatSearch = StyleSheet.create({

    searchButton: {
        height: 40,
        borderRadius: 40,
        backgroundColor: 'white',
        paddingLeft: 25,
        marginTop: 10,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15,
        shadowColor: "#000",
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 15
    },
});

export const productCard = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 10,
        alignItems:"center",
        width:'100%',
        backgroundColor:'#E5E5E5'
    },
    card:{
        width:350,
        backgroundColor:"white",
        padding:10,
        elevation:30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        flexDirection:"row",
    },
    profileImg:{
        width:50,
        height:50,
        marginRight:10,
    },
    header: {

    },
    title:{
        fontWeight:"bold",
        fontSize:18
    },
    text:{
        fontWeight:"bold",
        color:"gray"
    }
});

export const chatShow = StyleSheet.create({

    heading: {
        fontSize: 40,
    },
    description: {},
});

export const chatRoot = StyleSheet.create({

    image: {
        width: 45,
        height: 45,
        borderRadius: 45,
        margin: 10,
        borderWidth: 3,
        borderColor: '#FFF'
    },

    headerStyle: {
        backgroundColor: '#2196F3',
        height: 120,

    },
    headerTitleStyle: {
        fontWeight: 'bold'
    },
    cardStyle:{
        backgroundColor: '#E5E5E5'
    },
    cardStyleGetMessage:{
        backgroundColor:'#E6E6E6'
    }
});
