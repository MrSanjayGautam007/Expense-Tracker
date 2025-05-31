import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useTheme } from '@react-navigation/native';
const HeaderComp = ({ title, textColor, iconColor }) => {
    const navigation = useNavigation();
    // const { backgroundColor } = useTheme();
    const { width, height } = useWindowDimensions();
    return (
        <View style={[styles.mainView, { width }]}>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.iconStyle}
                onPress={() => navigation.goBack()}
                accessible={true}
                accessibilityLabel="Go back"
                accessibilityRole="button"
            >
                <Ionicons name={'arrow-back'} size={25} color={iconColor ? '#fff' : '#080909'} />
            </TouchableOpacity>
            <Text
                accessible={true}
                accessibilityLabel={`Screen title: ${title}`}
                accessibilityRole="header"

                style={[styles.textStyle, { color: textColor }]}>{title}</Text>
        </View>

    )
}

export default HeaderComp

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 10

    },
    textStyle: {
        // flex: 1, // Takes available space to center itself
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#512DA8',
       


    },
    iconStyle: {
        // position: 'absolute', // Keeps the icon in place
        // left: 13, // Aligns to the left
        width: 24,
        height: 24
    },

})