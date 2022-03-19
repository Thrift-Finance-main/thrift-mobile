import React, { FC } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, ScrollView } from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import Colors from '../../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
interface DropDownMenuProps {
    dropDownVisible: boolean,
    hideDropDownMenu: () => void,
    showDropDownMenu: () => void,
    languageList: any,
    dropDownText: string,
    updateDropDownText: (title: any, id?: any) => void
    isBlackTheme: any
    borderColor: any
}
const DropDownMenu: FC<DropDownMenuProps> = (props) => {
    return (
        <Menu
            style={{
                ...styles.menuContainer, backgroundColor:
                    props.isBlackTheme ? Colors.inputFieldBackground :
                        Colors.white,
            }}
            visible={props.dropDownVisible}
            anchor={<>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={props.showDropDownMenu}
                    style={{
                        ...styles.mainCOntainer, backgroundColor:
                            props.isBlackTheme ? Colors.darkInput :
                                Colors.white,
                        borderColor:
                            props.borderColor ? props.borderColor :
                                Colors.dropDownBorderColor,

                    }}>
                    <Text
                        style={{
                            color: props.isBlackTheme ? Colors.white : Colors.dropDownTextColor
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                    >{props.dropDownText}</Text>
                    {
                        props.dropDownVisible ?
                            <FontAwesomeIcon
                                name="angle-up"
                                size={20}
                            /> : <FontAwesomeIcon
                                name="angle-down"
                                size={20}
                                color={Colors.dropDownTextColor}
                            />
                    }
                </TouchableOpacity>
            </>
            }
            onRequestClose={props.hideDropDownMenu}>
            <ScrollView>
                {props.languageList.map((item: any, index: number) => {
                    return (
                        <View key={index}>
                            <MenuItem
                                textStyle={{ color: Colors.dropDownTextColor }}
                                style={styles.menuItemStyle}
                                onPress={() => props.updateDropDownText(item.title, item.id)}>{item.title}</MenuItem>
                            {props.languageList.length - 1 != index ?
                                <MenuDivider
                                    color={Colors.dropDownBorderColor}
                                /> : null}
                        </View>
                    )
                })}
            </ScrollView>
        </Menu>
    )
}
const styles = StyleSheet.create({
    mainCOntainer: {
        borderRadius: 5,
        height: heightPercentageToDP(7.5),
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 1,
        paddingHorizontal: widthPercentageToDP(6)
    },
    menuContainer: {
        marginTop: heightPercentageToDP(7.6),
        alignSelf: "center"
        //maxHeight: 1
    },
    dropDownText: {
        color: Colors.dropDownTextColor
    },
    menuItemStyle: {
        width: 200,
        height: heightPercentageToDP(6),
    }
})
export default DropDownMenu;
