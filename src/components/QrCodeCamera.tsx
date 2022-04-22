import {Linking, View} from "react-native";
import { withNavigationFocus } from "react-navigation";
import QRCodeScanner from "react-native-qrcode-scanner";
import React from "react";

type MyProps = {
    // using `interface` is also ok
    message: string;
    navigation: any
};
type MyState = {
    count: number; // like this
};
class QrCodeCamera extends React.Component<MyProps, MyState> {

    onSuccess = e => {
        const addr = e.data;
       console.log('e');
       console.log(e);
        Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err)
        );
    };
    renderCamera() {
        //const isFocused = this.props.navigation.isFocused();
        const isFocused = this.props.navigation.isFocused();

        if (!isFocused) {
            return null;
        } else if (isFocused) {
            return (
                <QRCodeScanner
                    onRead={this.onSuccess}
                />
            )
        }
    }
        render() {
            return (
                <View style={{ flex: 1 }}>
                    {this.renderCamera()}
                </View>
            )}

}

    // @ts-ignore
export default withNavigationFocus(QrCodeCamera);
