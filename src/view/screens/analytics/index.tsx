import { connect } from 'react-redux';

import Component from './Component';

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

const analyticsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default analyticsContainer;
