import React, { Component, PropTypes } from 'react';

export default class SimpleComponent extends Component {
  static propTypes = {
    children: PropTypes.any,
    testProp: PropTypes.bool
  };

  static defaultProps = {
    testProp: false
  };

  render() {
    const { children, testProp } = this.props;

    return (
      <div>
        <div>{children}</div>
        {testProp ? (
          <h4>Coverage is nice.</h4>
        ) : null}
      </div>
    );
  }
}
