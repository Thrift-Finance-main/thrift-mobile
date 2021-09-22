import * as React from 'react';
import {SafeAreaView, TouchableOpacity, Image, Button} from 'react-native';
import styles from './styles';
import { CText } from '../../elements/custom';
import { BUTTON_DEFAULT } from '../../elements/buttons';
import {getCurrentLang, getRoute, translate} from '../../../i18n';
import {withTranslation} from "react-i18next";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

import { StackScreenProps } from '@react-navigation/stack';

export type RootTabParamList = {
    Home: undefined;
    Settings: undefined;
    DetailsScreen: undefined;
};
type Props = StackScreenProps<RootTabParamList, 'Home'>;

type HomeScreenNavigationProp = Props['navigation'];
type HomeScreenRouteProp = Props['route'];

export interface HomeProps {
  name: string;
  componentId: string;
    navigation: HomeScreenNavigationProp;
    route: HomeScreenRouteProp;
}

interface HomeState {
  name: string;
  title: string;
}

class Home extends React.PureComponent<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      name: 'Redux + TypeScript + React Native Navigation + 2',
      title: '',
    };
  }

  componentDidMount() {}

  showPushScreen = () => {
    const { componentId } = this.props;

  }
  navigateTo = (route:string) => {
      // @ts-ignore
      this.props.navigation.navigate(translate('routes.settings'));
  }

  render() {
    const { name } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => this.navigateTo('settings')}>
            <Ionicons name={'person-circle-outline'} size={40} />
        </TouchableOpacity>
        <CText>Home</CText>
        <CText>{name}</CText>
        <CText>Result: {translate('title')}</CText>
        <CText>Lang: {getCurrentLang()}</CText>
        <BUTTON_DEFAULT onClick={this.showPushScreen} title={'Push Screen'} style={styles.button} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Home);
