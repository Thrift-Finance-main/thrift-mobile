import * as React from 'react';
import {SafeAreaView} from 'react-native';
import {withTranslation} from 'react-i18next';
import {StackScreenProps} from '@react-navigation/stack';
// eslint-disable-next-line import/extensions,import/no-unresolved
import styles from './styles';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {CText} from '../../elements/custom';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {BUTTON_DEFAULT} from '../../elements/buttons';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {getCurrentLang, translate} from '../../../i18n';
// @ts-ignore

// eslint-disable-next-line import/extensions,import/no-unresolved
import {createAccount, generateAdaMnemonic, generateWalletRootKey2} from '../../../lib/account';
import { addressSlice } from "../../../utils";

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
  acc: any;
  seed: string;
}

class Welcome extends React.PureComponent<WelcomeProps, WelcomeState> {
  constructor(props: WelcomeProps) {
    super(props);
    this.state = {
      name: 'This is the the view first time running the app',
      // eslint-disable-next-line react/no-unused-state
      acc: {},
      seed: '',
    };
  }

  componentDidMount() {}

  showPushScreen = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {componentId} = this.props;
  };

  getSeed = () => {
    // this.setState({ title: translate('title') });
      /*
    const seed: string = generateAdaMnemonic();
    console.log('seed');
    console.log(seed);
    this.setState({
      seed,
    });
    */
  };

  createAccount = async () => {
      /*
    const seed: string = generateAdaMnemonic();
    const acc = await createAccount(seed, 'Name2', 'password');
    console.log('acc');
    console.log(acc);
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      acc,
    });
    */
  };

  goHome = () => {
    // @ts-ignore
    // eslint-disable-next-line react/destructuring-assignment
    this.props.navigation.navigate('Main', {screen: 'Settings'});
  };

  callCardanoLib = async () => {
    // @ts-ignore
    // eslint-disable-next-line react/destructuring-assignment
    await generateAdaMnemonic();
  };

  render() {
    const {name} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <CText>Welcome</CText>
        <CText>{name}</CText>
        <CText>Result: {translate('title')}</CText>
        <CText>Lang: {getCurrentLang()}</CText>
        <BUTTON_DEFAULT onClick={this.goHome} title="Go to Home" />
        <BUTTON_DEFAULT onClick={this.callCardanoLib} title="Call Cardano Lib" />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Welcome);
