import React from 'react';
import VerticalBarGraph from '@chartiful/react-native-vertical-bar-graph';
import { Dimensions, StyleSheet } from 'react-native'
let BarGraph = () => {
    const config = {
        hasXAxisBackgroundLines: false,
        xAxisLabelStyle: {
            position: 'none',
            prefix: '$',
            color: "transparent"
        }
    };
    return (
        <VerticalBarGraph
            data={[20, 45, 28, 80, 99, 43, 50]}
            labels={['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']}
            width={375}
            height={300}
            barRadius={5}
            barWidthPercentage={0.65}
            withHorizontalLabels={false}
            barColor="#2f80ed"
            baseConfig={config}
            style={{
                marginBottom: 30,
                padding: 10,
                paddingTop: 20,
                borderRadius: 20,
                backgroundColor: `transparent`,
                width: 400,
                color: "blue",
            }}
        />
    )
}
const styles = StyleSheet.create({
    chart: {
        marginBottom: 30,
        padding: 10,
        paddingTop: 20,
        borderRadius: 20,
        width: 375,
    }
});
export default BarGraph
