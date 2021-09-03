import * as React from 'react';
import { AsyncStorage, SafeAreaView, Button } from 'react-native';

import styles from './styles';
import { CText } from '../../elements/custom';
import i18next from 'i18next';
import { STORAGE_KEY, translate } from '../../../i18n';
import { BUTTON_DEFAULT } from '../../elements/buttons';
import { withTranslation } from 'react-i18next';

export interface Props {}

interface State {
}

class Settings extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {}

  onChangeLang = async (lang: string) => {
    await i18next.changeLanguage(lang);
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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <CText>Settings</CText>
        <BUTTON_DEFAULT onClick={() => this.onChangeLang('es')} title={'Español'} />
        <BUTTON_DEFAULT onClick={() => this.onChangeLang('en')} title={'Ingles'} />
        <Button title={'Español'} onPress={() => this.onChangeLang('es')}/>
        <CText>Result: {translate('title')}</CText>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Settings);
