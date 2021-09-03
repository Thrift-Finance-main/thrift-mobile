import * as React from 'react';
import { AsyncStorage, SafeAreaView, Button } from 'react-native';

import styles from './styles';
import { CText } from '../../elements/custom';
import i18next from 'i18next';
import { STORAGE_KEY, translate } from '../../../i18n';
import { BUTTON_DEFAULT } from '../../elements/buttons';
import { withTranslation } from 'react-i18next';

import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
    Home: {name:string} | undefined;
    Settings: undefined;
    DetailsScreen: undefined;
};
type Props = BottomTabScreenProps<RootTabParamList, 'Settings'>;

type SettingsScreenNavigationProp = Props['navigation'];
type SettingsScreenRouteProp = Props['route'];

export interface SettingsProps {
    navigation: SettingsScreenNavigationProp;
    route: SettingsScreenRouteProp;
}
interface SettingsState {
}


class Settings extends React.PureComponent<SettingsProps, SettingsState> {

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {}

  onChangeLang = async (lang: string) => {
    await i18next.changeLanguage(lang);
    // @ts-ignore
    this.props.navigation.navigate(translate('navBottomTabs.settings'));
    /*
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
      this.setState({});
    } catch (error) {
      console.log(`onChangeLang() Error : ${error}`);
    }
    */
    console.log(i18next.dir());
  }
  goHome = (h:string) => {
      // @ts-ignore
      this.props.navigation.navigate(h);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <CText>Settings</CText>
        <BUTTON_DEFAULT onClick={() => this.onChangeLang('es')} title={'Español'} />
        <BUTTON_DEFAULT onClick={() => this.onChangeLang('en')} title={'Ingles'} />
        <Button title={'Español'} onPress={() => this.onChangeLang('es')}/>
        <Button title={'Go Home'} onPress={() => this.goHome(translate('navBottomTabs.home'))}/>
        <CText>Result: {translate('title')}</CText>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Settings);
