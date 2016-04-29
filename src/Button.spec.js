/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';
import Button from './Button';

describe('<Button />', () => {
  const testChildren = <span className="unique">Hello World</span>;

  it('renders children', () => {
    const wrapper = shallow(
      <Button>{testChildren}</Button>
    );

    assert.ok(wrapper.contains(testChildren), 'should contain the children');
  });
});
