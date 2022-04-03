import {Linking, View} from "react-native";
import { withNavigationFocus } from "react-navigation";
import {Component} from "react";
import QRCodeScanner from "react-native-qrcode-scanner";

class QrCodeCamera extends Component {

    onSuccess = e => {
        const addr = e.data;
       console.log('e');
       console.log(e);
        Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err)
        );
    };
    renderCamera() {
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
