import React, { FC } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import DarkBack from '../assets//DarkBack.svg'
import Back from '../assets/back.svg'
import PieChart from 'react-native-pie-chart';
import {
    LineChart,
    BarChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";


interface SmartFiProps {
    //   onContinuePress: () => void
    isBlackTheme: any
    onBackIconPress: () => void
    onCreateTargetPress: () => void
    onSavingsPress: () => void

}
const SmartFi: FC<SmartFiProps> = (props) => {
    const widthAndHeight = 220
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800']
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.white,
        }}>
            <View style={styles.secondaryContainer}>
                <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                >
                    {
                        props.isBlackTheme ?
                            <DarkBack
                                style={{ marginTop: heightPercentageToDP(3) }}
                                onPress={props.onBackIconPress}
                            />
                            : <Back
                                style={{ marginTop: heightPercentageToDP(3) }}
                                onPress={props.onBackIconPress}
                            />
                    }
                    <Text
                        style={{
                            ...styles.topTitle, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Smart FI</Text>
                </View>

                <View
                    style={{ justifyContent: "center", alignItems: "center", marginTop: heightPercentageToDP(10) }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.primaryButton, width: widthPercentageToDP(40), height: heightPercentageToDP(7),
                            justifyContent: "center", alignItems: "center"
                        }}
                        onPress={props.onCreateTargetPress}
                    >
                        <Text>Create Target</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{ justifyContent: "center", alignItems: "center", marginTop: heightPercentageToDP(10) }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.primaryButton, width: widthPercentageToDP(40), height: heightPercentageToDP(7),
                            justifyContent: "center", alignItems: "center"
                        }}
                        onPress={props.onSavingsPress}
                    >
                        <Text>Savings</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,

    },
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6)
    },
    topTitle: {
        fontSize: 18,
        fontWeight: "bold",
        // textAlign: "center",
        letterSpacing: 1,
        marginTop: heightPercentageToDP(3),
        paddingHorizontal: widthPercentageToDP(20),
        textAlign: "center"
    },
})
export default SmartFi;
