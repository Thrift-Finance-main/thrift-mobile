import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../store/Action';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity,Modal, ScrollView, Dimensions, ImageBackground } from 'react-native';
import Header from '../components/Common/Header';
import Colors from '../constants/CustomColors';
// @ts-ignore
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// @ts-ignore
import Feather from 'react-native-vector-icons/dist/Feather';
import PieChart from 'react-native-pie-chart';
import ExpensesChart from '../components/Common/ExpensesChart';
import BarGraph from '../components/Common/BarGraph';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Entypo from 'react-native-vector-icons/dist/Entypo';

const screens = Dimensions.get('window');
const SmartFiScreen2 = (props: any) => {
    const isBlackTheme = useSelector(state => state.Reducers.isBlackTheme);
    const dispatch = useDispatch();
    useEffect(() => {
        SplashScreen.hide();
        checkTheme();
    }, []);
    const checkTheme = async () => {
        let isBlackTheme = await AsyncStorage.getItem('isBlackTheme');
        console.log('shhshs', isBlackTheme);

        if (isBlackTheme == null) {
            dispatch(setTheme(false));
        } else {
            dispatch(setTheme(isBlackTheme == '0' ? true : false));
        }
    };

    let [activeTab, setActiveTab] = useState('investment');
    let [selectedFilter, setSelectedFilter] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    let [selectChart, setSelectChart] = useState("Bar")
    let [chartType, setChartType] = useState('Bar');
    let FilterData = [{ title: 'Wk' }, { title: 'Mn' }, { title: 'Yr' }];
    const widthAndHeight = 150;
    const series = [123, 321, 123];
    const sliceColor = ['#ffc61d', '#8e1af9', '#68f166'];

    let Slider2Card = [
        {
            imagePath: require('../assets/images/smartFi/slider4.png'),
            title: 'Phone Budget',
            per: '50%',
        },
        {
            imagePath: require('../assets/images/smartFi/slider5.png'),
            title: 'Pay Rent',
            per: '50%',
        },
        {
            imagePath: require('../assets/images/smartFi/slider3.png'),
            title: 'Travel Fund',
            per: '50%',
        },
    ];
    let ExpensesCard = [
        {
            iconType: 'up',
            name: 'N',
            heading: 'Now Payments',
            date: '28 Apr 2020',
            price: '-200 Ada',
        },
        {
            iconType: 'down',
            name: 'C',
            heading: 'Cardono Wallet',
            date: '10 Mar 2020',
            price: '+50 Ada',
        },
    ];
    let PaymentButton = [
        {
            title: 'Rent Payment',
            bgColor: '#f86f34',
        },
        {
            title: 'Entertainment',
            bgColor: '#005cee',
        },
        {
            title: 'Untility',
            bgColor: '#ffb731',
        },
        {
            title: 'Tuition',
            bgColor: '#f563bb',
        },
        {
            title: 'Groceries',
            bgColor: '#1ed37c',
        },
    ];
    return (
        <SafeAreaView style={{
            ...styles._container, backgroundColor:
                isBlackTheme ? Colors.blackTheme :
                    Colors.background,
        }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles._header_tips_mian}>
                    <Text style={{...styles._tips_heading, color: isBlackTheme ? Colors.white : Colors.black}}>Tips & Tricks</Text>
                    <TouchableOpacity>
                        <Text style={{...styles._view_all, color: isBlackTheme ? Colors.white : Colors.black}}>View All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity>
                        <ImageBackground
                            source={require('../assets/images/smartFi/slider2.png')}
                            style={styles._slider_image}>
                            <View style={styles._card_data_main}>
                                <Text  style={{...styles._card_data, color: isBlackTheme ? Colors.white : Colors.white}}>
                                    Habits that will{'\n'}increase you{'\n'}savings!
                                </Text>
                                <View style={styles._card_time_main}>
                                    <AntDesign name="clockcircleo" size={16} color="#fff" />
                                    <Text style={{...styles._card_time, color: isBlackTheme ? Colors.white : Colors.white}}>3 min read</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <ImageBackground
                            source={require('../assets/images/smartFi/slider1.png')}
                            style={styles._slider_image}>
                            <View style={styles._card_data_main}>
                                <Text style={{...styles._card_data, color: isBlackTheme ? Colors.white : Colors.white}}>
                                    How much money{'\n'}should you{'\n'}set adide?
                                </Text>
                                <View style={styles._card_time_main}>
                                    <AntDesign name="clockcircleo" size={16} color="#fff" />
                                    <Text style={{...styles._card_time, color: isBlackTheme ? Colors.white : Colors.white}}>3 min read</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles._tabs_main}>
                    <TouchableOpacity
                        style={
                            activeTab === 'investment' ? styles._active_tab : styles._tab
                        }
                        onPress={() => setActiveTab('investment')}>
                        <Text
                            style={{...
                                    activeTab === 'investment'
                                        ? styles._active_tab_text
                                        : styles._tab_text,
                            }}>
                            investment
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={activeTab === 'expenses' ? styles._active_tab : styles._tab}
                        onPress={() => setActiveTab('expenses')}>
                        <Text
                            style={{...
                                    activeTab === 'expenses'
                                        ? styles._active_tab_text
                                        : styles._tab_text,
                            }}
                        >
                            expenses
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={activeTab === 'income' ? styles._active_tab : styles._tab}
                        onPress={() => setActiveTab('income')}>
                        <Text
                            style={{...
                                    activeTab === 'income'
                                        ? styles._active_tab_text
                                        : styles._tab_text,
                            }}
                        >
                            income
                        </Text>
                    </TouchableOpacity>
                </View>
                {chartType === 'Pie' && (
                    <View>
                        {activeTab === 'investment' && (
                            <>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(!modalVisible)}
                                    style={styles._pie_setting}>
                                    <Feather name="settings" size={20} color="#2f80ed" />
                                </TouchableOpacity>
                                <View style={styles._pie_chart}>
                                    <PieChart
                                        widthAndHeight={widthAndHeight}
                                        series={series}
                                        sliceColor={sliceColor}
                                        doughnut={true}
                                        coverRadius={0.75}
                                        coverFill={'#fff'}
                                    />
                                </View>
                                <Text style={{...styles._pie_worth_heading, color: isBlackTheme ? Colors.white : Colors.black}}>Net Worth</Text>
                                <View style={styles._pie_price_main}>
                                    <Text style={{...styles._total_earning_price, color: isBlackTheme ? Colors.white : Colors.black}}>$452</Text>
                                    <View style={styles._new_worth_percentage_main}>
                                        <AntDesign name="caretup" size={16} color="green" />
                                        <Text style={{...styles._new_worth_percentage, color: isBlackTheme ? Colors.white : Colors.black}}>10%</Text>
                                    </View>
                                </View>
                                <Text style={{...styles._pie_Des, color: isBlackTheme ? Colors.white : Colors.black}}>Compared to $250 last month</Text>
                                <View style={styles._wave_main}>
                                    <Text style={{...styles._wave_heading, color: isBlackTheme ? Colors.white : Colors.black}}>Saving</Text>
                                    <Text style={{...styles._wave_percentage, color: isBlackTheme ? Colors.white : Colors.black}}>30%</Text>
                                    <MaterialCommunityIcons name="wave" size={30} color="#8e1af9" />
                                </View>
                                <View style={styles._wave_main}>
                                    <Text style={{...styles._wave_heading, color: isBlackTheme ? Colors.white : Colors.black}}>Lending</Text>
                                    <Text style={{...styles._wave_percentage, color: isBlackTheme ? Colors.white : Colors.black}}>54%</Text>
                                    <MaterialCommunityIcons name="wave" size={30} color="#68f166" />
                                </View>
                                <View style={styles._wave_main}>
                                    <Text style={{...styles._wave_heading, color: isBlackTheme ? Colors.white : Colors.black}}>Delegation</Text>
                                    <Text style={{...styles._wave_percentage, color: isBlackTheme ? Colors.white : Colors.black}}>16%</Text>
                                    <MaterialCommunityIcons name="wave" size={30} color="#ffc61d" />
                                </View>
                            </>
                        )}
                    </View>
                )}
                {chartType === 'Bar' && (
                    <View style={styles._new_worth_main}>
                        {activeTab === 'investment' && (
                            <>
                                <Text style={{...styles._new_worth_heading, color: isBlackTheme ? Colors.white : Colors.black}}>Net Worth:</Text>
                                <Text style={{...styles._new_worth_price, color: isBlackTheme ? Colors.white : Colors.black}}>$452</Text>
                                <View style={styles._new_worth_percentage_main}>
                                    <AntDesign name="caretup" size={16} color="green" />
                                    <Text style={{...styles._new_worth_percentage, color: isBlackTheme ? Colors.white : Colors.black}}>15%</Text>
                                </View>
                            </>
                        )}
                    </View>
                )}
                {chartType === 'Bar' && (
                    <View style={styles._filter_main}>
                        {activeTab === 'investment' && (
                            <>
                                <View>
                                    <Text
                                        style={{...styles._filter_heading, color: isBlackTheme ? Colors.white : Colors.black}}
                                    >
                                        {selectedFilter === 0 && "This Week"}
                                        {selectedFilter === 1 && "This Month"}
                                        {selectedFilter === 2 && "This Year"}
                                    </Text>
                                    <Text
                                        style={{...styles._filter_percentage, color: isBlackTheme ? Colors.white : Colors.black}}
                                    >2.5%</Text>
                                </View>
                                <View style={styles._filter_show_main}>
                                    {FilterData.map((v, i) => {
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => setSelectedFilter(i)}

                                                style={
                                                    selectedFilter === i
                                                        ? styles._selected_filter
                                                        : styles._filter
                                                }>
                                                <Text
                                                    style={{...
                                                            selectedFilter === i
                                                                ? styles._selected_filter_title
                                                                : styles._filter_title,
                                                        color: isBlackTheme && selectedFilter === i ? Colors.white : Colors.black
                                                    }}
                                                >
                                                    {v.title}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(!modalVisible)}>
                                        <Feather name="settings" size={20} color="#2f80ed" />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                )}
                {activeTab === 'expenses' && (
                    <View style={styles._expenses_data_main}>
                        <View style={styles._summery_show_mian}>
                            <View>
                                <Text style={{...styles._summery_heading, color: isBlackTheme ? Colors.white : Colors.black}}
                                >Expenses Summary</Text>
                                <Text style={{...styles._summery_date, color: isBlackTheme ? Colors.white : Colors.black}}
                                >
                                    01 Mar 2021 - 16 mar 2021
                                </Text>
                                <View>
                                    <ExpensesChart />
                                </View>
                            </View>
                        </View>
                        <View style={styles._payment_btn_main}>
                            {PaymentButton.map((paymentValue, paymenetIndex) => {
                                return (
                                    <TouchableOpacity
                                        key={paymenetIndex}
                                        style={[
                                            styles._payment_btn,
                                            { backgroundColor: paymentValue.bgColor },
                                        ]}>
                                        <Text style={{color: isBlackTheme ? Colors.white : Colors.black}}>{paymentValue.title}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View style={styles._in_out_main}>
                            <Text style={{...styles._in_out, color: isBlackTheme ? Colors.white : Colors.black}}>In & Out</Text>
                            <View style={styles._expenses_data_icons_main}>
                                <TouchableOpacity>
                                    <Feather name="arrow-down-circle" size={20} color="#4fac7a" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginLeft: 10 }}>
                                    <Feather name="arrow-up-circle" size={20} color="#db3a3a" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {ExpensesCard.map((expensesValue, expensesIndex) => {
                            return (
                                <View style={styles._expenses_card_main} key={expensesIndex}>
                                    <View style={styles._expenses_card_icon_main}>
                                        {expensesValue.iconType === 'up' && (
                                            <AntDesign name="arrowup" size={20} color="#db3a3a" />
                                        )}
                                        {expensesValue.iconType === 'down' && (
                                            <AntDesign name="arrowdown" size={20} color="#4aa977" />
                                        )}
                                        <View style={styles._expenses_card_name_main}>
                                            <Text style={{...styles._expenses_card_name, color: isBlackTheme ? Colors.white : Colors.black}}
                                            >
                                                {expensesValue.name}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={{...styles._expenses_card_heading, color: isBlackTheme ? Colors.white : Colors.black}}
                                            >
                                                {expensesValue.heading}
                                            </Text>
                                            <Text style={{...styles._expenses_card_date, color: isBlackTheme ? Colors.white : Colors.black}}
                                            >
                                                {expensesValue.date}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text
                                        style={[
                                            styles.__price,
                                            {
                                                color:
                                                    expensesValue.iconType === 'up'
                                                        ? '#db3a3a'
                                                        : '#4aa977',
                                            },
                                        ]}>
                                        {expensesValue.price}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                )}
                {chartType === 'Bar' && (
                    <>{activeTab === 'investment' && <BarGraph />}</>
                )}
                {activeTab === 'investment' && (
                    <>
                        <Text style={{...styles._heading, color: isBlackTheme ? Colors.white : Colors.black}}
                        >Start Target Goals</Text>
                        <ImageBackground
                            source={require('../assets/images/smartFi/goals.png')}
                            style={styles._goals_image}>
                            <View style={styles._goals_data_main}>
                                <Text  style={{...styles._goals_heading, color: isBlackTheme ? Colors.white : Colors.white}}
                                >Create a goal!</Text>
                                <Text style={{...styles._goals_des, color: isBlackTheme ? Colors.white : Colors.white}}
                                >
                                    Stay motivated and{'\n'}meet you futured{'\n'}goals
                                </Text>
                                <View style={styles._goals_btn_main}>
                                    <TouchableOpacity style={styles._goals_btn}>
                                        <Text style={{...styles._goals_btn_text, color: isBlackTheme ? Colors.black : Colors.black}}
                                        >View Savings</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles._goals_btn}>
                                        <Text style={{...styles._goals_btn_text, color: isBlackTheme ? Colors.black : Colors.black}}
                                        >Create Target</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                    </>
                )}
                {activeTab === 'income' && (
                    <View style={styles._income_main}>
                        <AnimatedCircularProgress
                            size={100}
                            width={10}
                            fill={90}
                            tintColor="#652ef5"
                            backgroundColor="#05050f">
                            {fill => <Text style={{...styles._Show_progress, color: isBlackTheme ? Colors.white : Colors.black}}>32%</Text>}
                        </AnimatedCircularProgress>

                        <View style={styles._income_data_main}>
                            <Text style={{...styles._toal_earning, color: isBlackTheme ? Colors.white : Colors.black}}
                            >Total Earning</Text>
                            <View style={styles._total_earning_price_main}>
                                <Text style={{...styles._total_earning_price, color: isBlackTheme ? Colors.white : Colors.black}}
                                >$452</Text>
                                <View style={styles._new_worth_percentage_main}>
                                    <AntDesign name="caretup" size={16} color="green" />
                                    <Text style={{...styles._new_worth_percentage, color: isBlackTheme ? Colors.white : Colors.black}}
                                    >10%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                {activeTab !== 'expenses' && (
                    <>
                        <Text style={{...styles._heading, color: isBlackTheme ? Colors.white : Colors.black}}>My Goal Reminders</Text>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {Slider2Card.map((sliderValue, sliderIndex) => {
                                return (
                                    <TouchableOpacity key={sliderIndex}>
                                        <ImageBackground
                                            source={sliderValue.imagePath}
                                            style={styles._slider2_image}>
                                            <View style={styles._slider2_data_main}>
                                                <Text style={{...styles._slider2_title, color: isBlackTheme ? Colors.white : Colors.white}}>
                                                    {sliderValue.title}
                                                </Text>
                                                <View>
                                                    <View style={styles._percentage_main}>
                                                        <View
                                                            style={[
                                                                styles._percentage_done,
                                                                { width: sliderValue.per },
                                                            ]}>
                                                            <Text
                                                                style={{...styles._percentage_done_show, color: isBlackTheme ? Colors.white : Colors.black}}
                                                            >
                                                                {sliderValue.per}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <Text style={{...styles._date, color: isBlackTheme ? Colors.white : Colors.black}}
                                                    >31 Mar 2020</Text>
                                                    <TouchableOpacity style={styles._add_funds_btn}>
                                                        <Text style={{...styles._add_funds_btn_text, color: isBlackTheme ? Colors.black : Colors.black}}
                                                        >
                                                            Add funds
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </>
                )}
                <View style={{ paddingBottom: 20 }} />
            </ScrollView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{...styles._model_heading, color: isBlackTheme ? Colors.white : Colors.black}}
                        >Select Chart Style</Text>
                        <TouchableOpacity
                            onPress={() => setSelectChart('Bar')}
                            style={styles._select_chart_btn}>
                            <View style={styles._radio_btn}>
                                {selectChart === 'Bar' && (
                                    <View style={styles._selected_radio_btn} />
                                )}
                            </View>
                            <Text style={{...styles._chart_title, color: isBlackTheme ? Colors.white : Colors.black}}
                            >Bar Chart</Text>
                            <Entypo name="bar-graph" size={20} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSelectChart('Pie')}
                            style={styles._select_chart_btn}>
                            <View style={styles._radio_btn}>
                                {selectChart === 'Pie' && (
                                    <View style={styles._selected_radio_btn} />
                                )}
                            </View>
                            <Text style={{...styles._chart_title, color: isBlackTheme ? Colors.white : Colors.black}}>Pie Chart</Text>
                            <Entypo name="pie-chart" size={20} color="#000" />
                        </TouchableOpacity>
                        <View style={styles._model_btn_mian}>
                            <TouchableOpacity
                                style={styles._model_cancel_btn}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={{...styles._model_cancel_btn_text, color: isBlackTheme ? Colors.white : Colors.black}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles._model_confirm_btn}
                                onPress={() => { setChartType(selectChart); setModalVisible(!modalVisible) }}>
                                <Text style={{...styles._model_confirm_btn_text, color: isBlackTheme ? Colors.white : Colors.black}}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

let styles = StyleSheet.create({
    _container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    _header_tips_mian: {
        marginTop: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
    _tips_heading: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    _view_all: {
        color: '#000',
        fontSize: 13,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    _slider_image: {
        width: screens.width - 70,
        height: 150,
        marginRight: 15,
        marginTop: 20,
    },
    _slider2_image: {
        width: screens.width - 225,
        height: 190,
        marginRight: 15,
        marginTop: 20,
    },
    _card_data_main: {
        padding: 15,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    _card_data: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    _card_time_main: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    _card_time: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 5,
        fontWeight: 'bold',
    },
    _tabs_main: {
        backgroundColor: '#e9eeff',
        marginTop: 30,
        borderRadius: 100,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    _active_tab: {
        backgroundColor: '#fff',
        elevation: 1,
        borderRadius: 100,
        height: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    _active_tab_text: {
        color: '#000',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    _tab: {
        backgroundColor: '#e9eeff',
        borderRadius: 100,
        height: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    _tab_text: {
        color: 'gray',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    _new_worth_main: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    _new_worth_heading: {
        color: 'gray',
        fontSize: 14,
    },
    _new_worth_price: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10,
    },
    _new_worth_percentage_main: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    _new_worth_percentage: {
        color: 'green',
        fontSize: 14,
    },
    _filter_main: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    _filter_heading: {
        color: 'gray',
        fontSize: 16,
    },
    _filter_percentage: {
        color: 'green',
        fontSize: 16,
    },
    _selected_filter: {
        backgroundColor: '#2f80ed',
        borderRadius: 5,
        paddingVertical: 3,
        marginRight: 5,
        paddingHorizontal: 5,
    },
    _filter: {
        backgroundColor: '#e8f1fd',
        borderRadius: 5,
        paddingVertical: 3,
        marginRight: 5,
        paddingHorizontal: 5,
    },
    _filter_show_main: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    _selected_filter_title: {
        color: '#fff',
        fontSize: 16,
    },
    _filter_title: {
        color: '#738aa9',
        fontSize: 16,
    },
    _heading: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 20,
    },
    _slider2_title: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        marginHorizontal: 10,
    },
    _slider2_data_main: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
    },
    _percentage_main: {
        backgroundColor: '#bebee3',
        height: 15,
        borderRadius: 100,
    },
    _percentage_done: {
        backgroundColor: '#4ebd7d',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: 15,
    },
    _percentage_done_show: {
        color: '#fff',
        fontSize: 10,
    },
    _date: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 10,
        marginVertical: 2,
    },
    _add_funds_btn: {
        backgroundColor: '#edf4fd',
        borderRadius: 100,
        width: '70%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    _add_funds_btn_text: {
        color: 'gray',
        fontSize: 12,
        paddingVertical: 3,
    },
    _goals_image: {
        height: 174,
        marginTop: 20,
    },
    _goals_data_main: {
        padding: 10,
    },
    _goals_heading: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    _goals_des: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
    },
    _goals_btn_main: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 35,
    },
    _goals_btn: {
        backgroundColor: '#fff',
        borderRadius: 100,
        paddingVertical: 5,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    _goals_btn_text: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 15,
    },
    _in_out: {
        color: '#000',
        fontSize: 16,
    },
    _expenses_data_main: {
        marginTop: 30,
    },
    _expenses_data_icons_main: {
        flexDirection: 'row',
    },
    _in_out_main: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    _expenses_card_main: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    _expenses_card_icon_main: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    _expenses_card_name_main: {
        backgroundColor: '#eef2f8',
        width: 40,
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    _expenses_card_name: {
        color: '#005cee',
        fontWeight: 'bold',
        fontSize: 16,
    },
    _expenses_card_heading: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    _expenses_card_date: {
        color: 'gray',
        fontSize: 13,
    },
    __price: {
        fontSize: 16,
    },
    _payment_btn_main: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    _payment_btn: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 100,
        marginRight: 10,
        marginTop: 10,
    },
    _summery_show_mian: {},
    _summery_heading: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
    },
    _summery_date: {
        color: 'gray',
        fontSize: 10,
        marginBottom: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 15,
        width: '70%',
        elevation: 3,
        paddingVertical: 10,
    },
    _model_heading: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
    },
    _chart_title: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 10,
    },
    _select_chart_btn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
    },
    _radio_btn: {
        borderWidth: 1,
        borderColor: '#3e83f2',
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    _selected_radio_btn: {
        backgroundColor: '#3e83f2',
        width: 15,
        height: 15,
        borderRadius: 15 / 2,
    },
    _model_btn_mian: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    _model_cancel_btn: {
        backgroundColor: '#eef2f8',
        borderRadius: 100,
        width: '45%',
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    _model_cancel_btn_text: {
        color: '#000',
        fontSize: 14,
    },
    _model_confirm_btn: {
        backgroundColor: '#005cee',
        borderRadius: 100,
        width: '45%',
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    _model_confirm_btn_text: {
        color: '#fff',
        fontSize: 14,
    },
    _pie_setting: {
        marginTop: 30,
        alignSelf: 'flex-end',
    },
    _income_data_main: {
        marginLeft: 20,
    },
    _income_main: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30,
    },
    _toal_earning: {
        color: 'gray',
        fontWeight: 'bold',
        fontSize: 15,
    },
    _total_earning_price_main: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    _total_earning_price: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
    },
    _Show_progress: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
    },
    _pie_chart: {
        alignSelf: 'center',
        marginTop: 20,
    },
    _pie_worth_heading: {
        color: 'gray',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    _pie_price_main: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    _pie_Des: {
        color: 'gray',
        fontSize: 14,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    _wave_main: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '60%',
        alignSelf: 'center',
        marginTop: 15,
    },
    _wave_heading: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    _wave_percentage: {
        color: 'gray',
        fontSize: 16,
        fontWeight: 'bold',
    },
})
export default SmartFiScreen2;
