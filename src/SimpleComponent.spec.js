/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';
import SimpleComponent from './SimpleComponent';

describe('<SimpleComponent />', () => {
  const testChildren = <div className="unique">Hello World</div>;

  it('renders children by default', () => {
    const wrapper = shallow(
      <SimpleComponent>{testChildren}</SimpleComponent>
    );

    assert.ok(wrapper.contains(testChildren), 'should contain the children');
  });
});
