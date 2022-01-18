import {connect} from 'react-redux';

import Component from './Component';

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

const mapDispatchToProps = () => ({});

const welcomeContainer = connect<MapStateToPropsTypes, MapDispatchToPropsTypes>(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default welcomeContainer;
