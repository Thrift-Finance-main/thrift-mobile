import React from 'react';
import {
    Text,
    View,
    Dimensions
} from 'react-native';
import { PieChart } from 'react-native-svg-charts';

class ExpensesChart extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedSlice: {
                label: '',
                value: 0
            },
            labelWidth: 0
        }
    }
    render() {
        const { labelWidth, selectedSlice } = this.state;
        const { label, value } = selectedSlice;
        const keys = ['google', 'facebook', 'linkedin', 'youtube', 'Twitter'];
        const values = [10, 25, 15, 25, 25];
        const colors = ['#f86f34', '#005cee', '#ffb731', '#f563bb', '#1ed37c']
        const data = keys.map((key, index) => {
            return {
                key,
                value: values[index],
                svg: { fill: colors[index] },
                arc: { outerRadius: (70 + values[index]) + '%', padAngle: label === key ? 0.1 : 0 },
                onPress: () => this.setState({ selectedSlice: { label: key, value: values[index] } })
            }
        })
        const deviceWidth = Dimensions.get('window').width

        return (
            <View style={{ justifyContent: 'center' }}>
                <PieChart
                    style={{ height: 150 }}
                    outerRadius={'80%'}
                    innerRadius={'45%'}
                    data={data}
                />
                <Text
                    onLayout={({ nativeEvent: { layout: { width } } }) => {
                        this.setState({ labelWidth: width });
                    }}
                    style={{
                        position: 'absolute',
                        left: deviceWidth / 2 - labelWidth / 2,
                        textAlign: 'center',
                        color: "#000",
                        fontWeight: "bold",
                        fontSize: 20,
                        marginLeft: -20
                    }}>
                    $300
                </Text>
            </View>
        )
    }
}

export default ExpensesChart;
