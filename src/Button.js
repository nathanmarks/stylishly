import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Button extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    type: PropTypes.oneOf(['flat', 'raised'])
  };

  static defaultProps = {
    type: 'flat',
  };

  renderTest() {
    return 'woof';
  }

  render() {
    const {
      children,
      className,
      type
    } = this.props;

    const classes = classNames({
      'btn': true,
      [`btn--${type}`]: true
    }, className);

    return (
      <button className={classes}>
        {children}
      </button>
    );
  }
}
