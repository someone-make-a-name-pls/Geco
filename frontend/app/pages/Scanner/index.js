import React from 'react';
import { Text, SafeAreaView, View, Image} from 'react-native';
import { useState } from "react"

import DisplayButtons from '../../components/DisplayButtons';
import { styles } from './styles';
import PhotoSelect from '../../components/PhotoSelect';
function Scanner() {
    
    const [image, setImage] = useState(null)

    return (
        <SafeAreaView style={styles.container}>
            <View style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Image style={{height: 50, width: 100, objectFit: "contain"}} source={require('../../../assets/geco_logo.jpg')}/>
            </View>
            <Text style={styles.titleStyle}>
                Scan A Photo For Disposal Recommendations
            </Text>

            <PhotoSelect image={image} setImage={setImage} onSelect={() => {}}/>
            
            <DisplayButtons currentPath='Scanner' />

        </SafeAreaView>
    )

}
export default Scanner;
