import {connect} from 'react-redux';

import Component from './Component';
import {setCurrentAccount} from '../../../redux/actions/AccountActions';

interface MapStateToPropsTypes {
  // Your properties here
}

interface MapDispatchToPropsTypes {
  // Your properties here
}

const mapStateToProps = (state: any) => {
  return {
    currentAccountName: state.currentAccountName,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentAccount: (currentAccount: string) =>
      dispatch(setCurrentAccount(currentAccount)),
  };
};

const welcomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default welcomeContainer;
