import { connect } from 'react-redux';

import Component from './Component';

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

const servicesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default servicesContainer;
