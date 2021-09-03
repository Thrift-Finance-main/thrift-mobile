import * as React from 'react';
import { SafeAreaView, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { CText } from '../../elements/custom';
import { BUTTON_DEFAULT } from '../../elements/buttons';
import { getCurrentLang, translate } from '../../../i18n';
import {withTranslation} from "react-i18next";

export interface Props {
  name: string;
  componentId: string;
}

interface State {
  name: string;
  title: string;
}

class Home extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: props.name || 'Redux + TypeScript + React Native Navigation + 2',
      title: '',
    };
  }

  componentDidMount() {}

  showBurgerMenu () {

  }

  showPushScreen = () => {
    const { componentId } = this.props;

  }
  updateTitle = () => {
    // this.setState({ title: translate('title') });
  }

  render() {
    const { name } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={this.showBurgerMenu}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../../assets/images/burger-menu.png')}
          />
        </TouchableOpacity>
        <CText>Home</CText>
        <CText>{name}</CText>
        <CText>Result: {translate('title')}</CText>
        <CText>Lang: {getCurrentLang()}</CText>
        <BUTTON_DEFAULT onClick={this.updateTitle} title={'update Title'}/>
        <BUTTON_DEFAULT onClick={this.showPushScreen} title={'Push Screen'} style={styles.button} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Home);
