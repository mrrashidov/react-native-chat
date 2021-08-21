import * as React from 'react';
import {Text, View, Image} from 'react-native';
import {productCard} from "../styles";

const productImg = "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSqfytcLGtzeDqOoHcdRMiK--AxURCmKdv7HMEY7IHkzvHxKq6vyaRDzKLZU6LZxPKN4EL6qVvgU7eXFjx_Ue7w9aHk7gs62eDT4oj8qnudBV5X1AALI7L9pw&usqp=CAE"

export default function Product() {
    return (
        <View>
            {/*bu yerda flat list bor va xar bir itemda onPress boladi*/}
            <View style={ productCard.container }>
                <View style={productCard.card}>
                    <Image style={productCard.profileImg} source={{uri: productImg}}/>
                    <View style={productCard.header}>
                        <Text style={productCard.title}>React Native Master</Text>
                        <Text style={productCard.text}> RM350 • New</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
