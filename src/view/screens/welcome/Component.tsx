import * as React from 'react';
import {SafeAreaView, View} from 'react-native';
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
import {createAccount, generateAdaMnemonic} from '../../../lib/account';
import realmDb from '../../../db/RealmConfig';
import {IAccount} from '../../../db/model/AccountModel';

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
    console.log('accInState');
    const accInState = await realmDb.getAllAccounts();
    console.log(accInState);
    const seed: string = generateAdaMnemonic();
    const acc: IAccount = await createAccount(seed, 'Name2', 'password');
    console.log('acc');
    console.log(JSON.stringify(acc, null, 2));

    await realmDb.addAccount(acc);

    console.log('accInState2');
    const accInState2 = await realmDb.getAllAccounts();
    console.log(accInState2);

    await realmDb.removeAccount('Name2');

    const acc1 = await realmDb.getAccount('Name2');
    const acc2 = await realmDb.getAccount('Bob');

    console.log('acc1');
    console.log(acc1);
    console.log('acc2');
    console.log(acc2);

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      acc,
      seed,
    });
    // lets update the db
  };

  goHome = () => {
    // @ts-ignore
    // eslint-disable-next-line react/destructuring-assignment
    this.props.navigation.navigate('Main', {screen: 'Settings'});
  };

  render() {
    const {name, acc, seed} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <CText>Welcome</CText>
        <CText>{name}</CText>
        <CText>Result: {translate('title')}</CText>
        <CText>Lang: {getCurrentLang()}</CText>
        <BUTTON_DEFAULT onClick={this.goHome} title="Go to Home" />
        <BUTTON_DEFAULT onClick={this.createAccount} title="Create account" />

        {seed.length ? (
          <View>
            <CText>seed</CText>
            <CText>{seed}</CText>
          </View>
        ) : null}

        {acc && acc.publicKeyHex && acc.publicKeyHex.length ? (
          <View>
            <CText>acc</CText>
            <CText>{JSON.stringify(acc, null, 2)}</CText>
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Welcome);
