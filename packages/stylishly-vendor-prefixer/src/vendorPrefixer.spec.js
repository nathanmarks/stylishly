/* eslint-env mocha */
import { assert } from 'chai';
import { spy } from 'sinon';
import vendorPrefixer from './vendorPrefixer';

describe('plugins/vendorPrefixer.js', () => {
  const prefix = spy();
  const vendorPrefixerPlugin = vendorPrefixer(prefix);

  it('should call the prefix function on the declaration', () => {
    const rule = {
      name: 'button',
      type: 'style',
      selectorText: '.button',
      declaration: {
        display: 'flex',
      },
    };

    vendorPrefixerPlugin.addRuleHook(rule);

    assert.strictEqual(
      prefix.calledWith({
        display: 'flex',
      }),
      true
    );
  });
});
