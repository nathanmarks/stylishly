/* eslint-env mocha */
import { assert } from 'chai';
import { spy } from 'sinon';
import vendorPrefixer from './vendorPrefixer';

describe('plugins/vendorPrefixer.js', () => {
  const prefixer = { prefix: spy() };
  const vendorPrefixerPlugin = vendorPrefixer({ prefixer });

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
      prefixer.prefix.calledWith({
        display: 'flex',
      }),
      true
    );
  });
});
