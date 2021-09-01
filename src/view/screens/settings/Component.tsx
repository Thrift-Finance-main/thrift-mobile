import * as React from 'react';
import { AsyncStorage, SafeAreaView } from 'react-native';

import styles from './styles';
import { CText } from '../../elements/custom';
import i18next from 'i18next';
import { STORAGE_KEY } from '../../../i18n';

export interface Props {}

interface State {}

class Settings extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  async onChangeLang(lang:string) {
    await i18next.changeLanguage(lang);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.log(`onChangeLang() Error : ${error}`);
    }
    console.log(i18next.dir());
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <CText>Settings</CText>
      </SafeAreaView>
    );
  }
}

export default Settings;
