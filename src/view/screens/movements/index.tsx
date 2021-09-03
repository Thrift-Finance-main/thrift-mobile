import { connect } from 'react-redux';

import Component from './Component';

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

const movementsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default movementsContainer;
