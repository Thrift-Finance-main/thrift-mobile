import * as React from 'react';
import {Picker, SafeAreaView, ScrollView, TextInput, View} from 'react-native';
import {withTranslation} from 'react-i18next';
import {StackScreenProps} from '@react-navigation/stack';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {connect} from 'react-redux';
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
import {setCurrentAccount} from '../../../redux/actions/AccountActions';

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
  currentAccountName: string;
  navigation: WelcomeScreenNavigationProp;
  route: WelcomeScreenRouteProp;
  setCurrentAccount: (currentAccount: string) => void;
}

interface WelcomeState {
  name: string;
  acc: any;
  allAccounts: any[];
  seed: string;
}

class Welcome extends React.PureComponent<WelcomeProps, WelcomeState> {
  constructor(props: WelcomeProps) {
    super(props);
    console.log(props);
    this.state = {
      name: '',
      // eslint-disable-next-line react/no-unused-state
      acc: {},
      seed: '',
      allAccounts: [],
    };
  }

  async componentDidMount() {
    console.log('All acounts');
    //const allAccounts = await realmDb.getAllAccounts();
    //console.log(allAccounts);


    console.log('\n\nthis.props.currentAccountName');
    const {currentAccountName} = this.props;

    console.log(currentAccountName);
    // const config = await realmDb.getConfig();

    // const accountName = await realmDb.getCurrentAccount();

  }

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
    // eslint-disable-next-line react/destructuring-assignment

    const {name} = this.state;
    if (name.length) {
      console.log('accInState');
      //const accInState = await realmDb.getAllAccounts();
      /*
      console.log(accInState);
      const seed: string = generateAdaMnemonic();
      const acc: IAccount = await createAccount(
        seed,
        name,
        'password',
        '123456',
      );
      console.log('acc');
      console.log(JSON.stringify(acc, null, 2));

      realmDb.addAccount(acc).then(() => {
        console.log('Set current account on redux');
        const {setCurrentAccount} = this.props;
        console.log(setCurrentAccount);
        setCurrentAccount(acc.accountName);

        console.log('\n\nthis.props.currentAccountName after addAccount');
        const {currentAccountName} = this.props;
        console.log(currentAccountName);
      });

      // await realmDb.removeAccount('Alice');

      // const acc1 = await realmDb.getAccount('Name2');

      this.setState({
        // eslint-disable-next-line react/no-unused-state
        acc,
        seed,
      });
      // lets update the db

       */
    }
  };

  goHome = () => {
    // @ts-ignore
    // eslint-disable-next-line react/destructuring-assignment
    this.props.navigation.navigate('Main', {screen: 'Settings'});
  };

  onChangeName = (name: string) => {
    this.setState({
      name,
    });
  };

  resetCurrentAccount = async () => {
    // @ts-ignore
    // eslint-disable-next-line react/destructuring-assignment
    // await realmDb.setCurrentAccount('');
  };

  setSelectedValue = (value: string) => {
    const {allAccounts} = this.state;

    console.log('setSelectedValue in Welcome');
    const acc = allAccounts.filter(acc => acc.accountName === value)[0];
    console.log(acc);
    // realmDb.setCurrentAccount(acc.accountName).then(r => {});
    this.setState({
      name: value,
      acc,
    });
  };

  renderAccountSelect = () => {
    const {name, allAccounts} = this.state;

    return (
      <Picker
        selectedValue={name}
        style={{height: 50, width: 150}}
        onValueChange={(itemValue, itemIndex) =>
          this.setSelectedValue(itemValue)
        }>
        {allAccounts.map(acc => {
          return (
            <Picker.Item label={acc.accountName} value={acc.accountName} />
          );
        })}
      </Picker>
    );
  };

  render() {
    const {acc, seed} = this.state;

    return (
      <ScrollView style={styles.container}>
        <CText>Welcome</CText>
        {this.renderAccountSelect()}
        <CText>Result: {translate('title')}</CText>
        <CText>Lang: {getCurrentLang()}</CText>
        <BUTTON_DEFAULT onClick={this.goHome} title="Go to Home" />
        <TextInput
          style={{}}
          onChangeText={text => this.onChangeName(text)}
          placeholder="Create new account"
        />
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
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: any) => {
  console.log('\n\nstate');
  console.log(state);
  return {
    currentAccountName: state.AccountReducer.currentAccountName,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentAccount: (currentAccount: string) =>
      dispatch(setCurrentAccount(currentAccount)),
  };
};

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Welcome),
);
