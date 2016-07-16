/* eslint-env mocha */
import { assert } from 'chai';
import { getClassNames } from 'packages/stylishly/src/styleSheet';
import { createKitchenSinkSheet } from 'test/fixtures/styleSheets/kitchenSink';

describe('kitchen sink', () => {
  let rules;

  before(() => {
    const sink = createKitchenSinkSheet();
    rules = sink.rules;
  });

  it('should have 15 rules', () => assert.strictEqual(rules.length, 15));

  it('should have the correct classNames', () => {
    const classes = getClassNames(rules);
    const properties = ['base', 'button', 'primary', 'titanic', 'container', 'hoisted'];
    assert.strictEqual(Object.keys(classes).length, properties.length, 'should have the correct number of classes');
    properties.forEach((n) => {
      assert.strictEqual(classes[n], `foo__${n}--a`);
    });
  });

  it('should add all of the flexbox browser properties', () => {
    assert.strictEqual(rules[0].selectorText, '.foo__base--a');
    assert.deepEqual(rules[0].declaration, {
      display: [
        '-webkit-box',
        '-moz-box',
        '-ms-flexbox',
        '-webkit-flex',
        'flex',
      ],
      alignItems: 'center',
      justifyContent: 'flex-end',
      WebkitAlignItems: 'center',
      msFlexAlign: 'center',
      WebkitBoxAlign: 'center',
      WebkitJustifyContent: 'flex-end',
      msFlexPack: 'end',
      WebkitBoxPack: 'end',
    });
  });

  it('should add an empty declaration for the button', () => {
    assert.strictEqual(rules[1].selectorText, '.foo__button--a');
    assert.strictEqual(rules[1].className, 'foo__button--a');
    assert.strictEqual(rules[1].name, 'button');
    assert.deepEqual(rules[1].declaration, {});
  });

  it('should add a descendant selector for button', () => {
    assert.strictEqual(rules[2].selectorText, '.foo__base--a .foo__button--a');
    assert.deepEqual(rules[2].declaration, { color: 'red', 'minWidth': '64px' });
  });

  it('should add a descendant pseudo class selector for the hover state of button', () => {
    assert.strictEqual(rules[3].selectorText, '.foo__base--a .foo__button--a:hover');
    assert.deepEqual(rules[3].declaration, { color: 'blue' });
  });

  it('should add a chained descendant selector for the primary state of button in base', () => {
    assert.strictEqual(rules[4].selectorText, '.foo__base--a .foo__button--a.foo__primary--a');
    assert.deepEqual(rules[4].declaration, { color: 'purple' });
  });

  it('should sink the titanic', () => {
    assert.strictEqual(rules[5].selectorText, '.foo__titanic--a');
    assert.deepEqual(rules[5].declaration, { float: 'none' });
  });

  it('should be a media query', () => {
    assert.strictEqual(rules[6].type, 'media');
    assert.strictEqual(rules[6].mediaText, '@media (min-width: 800px)');
  });

  describe('inside the media query rule', () => {
    it('should be a rule to refloat the titanic', () => {
      assert.deepEqual(rules[7].declaration, { float: 'left' });
      assert.strictEqual(rules[7].selectorText, '.foo__titanic--a');
      assert.strictEqual(rules[7].parent, rules[6], 'should have the media query as a parent');
    });

    it('should be an empty button declaration (won\'t get rendered)', () => {
      assert.deepEqual(rules[8].declaration, {});
      assert.strictEqual(rules[8].selectorText, '.foo__button--a');
      assert.strictEqual(rules[8].parent, rules[6], 'should have the media query as a parent');
    });

    it('should be a rule to remove the minWidth from button', () => {
      assert.deepEqual(rules[9].declaration, { 'minWidth': 'none' });
      assert.strictEqual(rules[9].selectorText, '.foo__base--a .foo__button--a');
      assert.strictEqual(rules[9].parent, rules[6], 'rule have the media query as a parent');
    });
  });

  describe('media query nested in reverse', () => {
    it('should be the container', () => {
      assert.strictEqual(rules[10].selectorText, '.foo__container--a');
      assert.strictEqual(rules[10].className, 'foo__container--a');
      assert.strictEqual(rules[10].name, 'container');
      assert.deepEqual(rules[10].declaration, { width: '20px' });
    });

    it('should be another media query', () => {
      assert.strictEqual(rules[11].type, 'media');
      assert.strictEqual(rules[11].mediaText, '@media (min-width: 500px)');
    });

    it('should have the bigger container inside the media query', () => {
      assert.deepEqual(rules[12].declaration, { width: '100px' });
      assert.strictEqual(rules[12].selectorText, '.foo__container--a');
      assert.strictEqual(rules[12].className, 'foo__container--a');
      assert.strictEqual(rules[12].name, 'container');
      assert.strictEqual(rules[12].parent, rules[11], 'should have the media query as a parent');
    });
  });

  describe('media query with hoisted exposed className', () => {
    it('should be a max-width media query', () => {
      assert.strictEqual(rules[13].type, 'media');
      assert.strictEqual(rules[13].mediaText, '@media (max-width: 1024px)');
    });

    it('should have the hoisted rule inside the media query', () => {
      assert.deepEqual(rules[14].declaration, { color: 'green' });
      assert.strictEqual(rules[14].selectorText, '.foo__hoisted--a');
      assert.strictEqual(rules[14].className, 'foo__hoisted--a');
      assert.strictEqual(rules[14].name, 'hoisted');
      assert.strictEqual(rules[14].parent, rules[13], 'should have the media query as a parent');
    });
  });
});
