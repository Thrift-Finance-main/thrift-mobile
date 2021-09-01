import * as React from 'react';
import { Navigation } from 'react-native-navigation';
import { SafeAreaView, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { CText } from '../../elements/custom';
import router from '../../../navigators/router';
import { BUTTON_DEFAULT } from '../../elements/buttons';
import { getCurrentLang, translateCell } from '../../../i18n';
import i18next from 'i18next';

export interface Props {
  name: string;
  componentId: string;
}

interface State {
  name: string;
}

function translateCell2(cell:string) {
  return (i18next.t(cell));
}

class Home extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      name: props.name || 'Redux + TypeScript + React Native Navigation + 2',
    };
  }

  componentDidMount() {}

  showBurgerMenu () {
    Navigation.mergeOptions('drawerComponentId', {
      sideMenu: {
        left: {
          visible: true,
        },
      },
    });
  }

  showPushScreen = () => {
    const { componentId } = this.props;
    router.showPushScreen({
      componentId,
      passProps: {
        dummyText: 'Hello from Home !!!',
      },
    });
  }

  render() {
    const { name } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={this.showBurgerMenu}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/images/burger-menu.png')}
          />
        </TouchableOpacity>
        <CText>Home</CText>
        <CText>{name}</CText>
        <CText>Result: {translateCell('key')}</CText>
        <CText>Lang: {getCurrentLang()}</CText>
        <BUTTON_DEFAULT onClick={this.showPushScreen} title={'Push Screen'} style={styles.button} />
      </SafeAreaView>
    );
  }
}

export default Home;
