import * as React from 'react';
import {SafeAreaView, TouchableOpacity, Image, Button} from 'react-native';
import styles from './styles';
import { CText } from '../../elements/custom';
import { BUTTON_DEFAULT } from '../../elements/buttons';
import { getCurrentLang, translate } from '../../../i18n';
import {withTranslation} from "react-i18next";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

import { StackScreenProps } from '@react-navigation/stack';
import {generateAdaMnemonic} from "../../../lib/account";

export type RootTabParamList = {
    Home: undefined;
    Welcome: undefined;
    Settings: undefined;
    DetailsScreen: undefined;
};
type Props = StackScreenProps<RootTabParamList, 'Welcome'>;

type WelcomeScreenNavigationProp = Props['navigation'];
type WelcomeScreenRouteProp = Props['route'];

export interface WelcomeProps {
  name: string;
  componentId: string;
    navigation: WelcomeScreenNavigationProp;
    route: WelcomeScreenRouteProp;
}

interface WelcomeState {
  name: string;
  title: string;
  seed: string;
}

class Welcome extends React.PureComponent<WelcomeProps, WelcomeState> {
  constructor(props: WelcomeProps) {
    super(props);
    this.state = {
      name: 'This is the the view first time running the app',
      title: '',
      seed: '',
    };
  }

  componentDidMount() {}

  showBurgerMenu () {

  }

  showPushScreen = () => {
    const { componentId } = this.props;

  }
  createAccount = () => {
    // this.setState({ title: translate('title') });
    // @ts-ignore
      //this.props.navigation.navigate('Main', { screen: 'Settings' });
      const seed = generateAdaMnemonic();
      this.setState({
          seed: seed
      })
  }

  render() {
    const { name, seed } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <CText>Welcome</CText>
        <CText>{name}</CText>
        <CText>Result: {translate('title')}</CText>
        <CText>Lang: {getCurrentLang()}</CText>
        <BUTTON_DEFAULT onClick={this.createAccount} title={'Create Account'}/>
        <CText>{seed}</CText>
        <BUTTON_DEFAULT onClick={this.showPushScreen} title={'Restore Account'} style={styles.button} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Welcome);
