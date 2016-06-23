# WIP: Stylishly
[![Build Status](https://img.shields.io/circleci/project/nathanmarks/stylishly/master.svg?style=flat-square)](https://circleci.com/gh/nathanmarks/stylishly)
[![Coverage Status](https://img.shields.io/coveralls/nathanmarks/stylishly/master.svg?style=flat-square)](https://coveralls.io/github/nathanmarks/stylishly)
[![npm](https://img.shields.io/npm/v/stylishly.svg?style=flat-square)](https://www.npmjs.com/package/stylishly)

**Stylishly is a WIP. At your own peril.**

---

Stylishly is a JavaScript library designed for controlling CSS styling in a component based framework.

## Features

 - CSS in JS
 - Theming
 - Real stylesheets
 - Deterministic className resolution
 - Webpack HMR compatibile
 - Server side rendering
 - Plugin system and custom renderers (allows you to customize pretty much anything)
 - `@media` queries _(optional plugin)_
 - `:pseudo` selectors _(optional plugin)_
 - Autoprefixing _(optional plugin)_

## Design & Justification

Over at [callemall/material-ui](https://github.com/callemall/material-ui) we've struggled to make inline-only styles work smoothly both internally and for our users due to various drawbacks ranging from difficulty overriding styles to the requirement to add significant boilerplate code in order to implement basic CSS functionality such as `:hover` in JS.

Stylishly allows you to use JavaScript to create **real** stylesheets in a fashion that meshes well with a component based design. This enables use of the usual suspects (media queries, pseudo selectors, etc...), which are impossible with an inline-only solution.

Another important requirement for `stylishly` was enabling use of a theme object for style creation. Themes and customization are a central part of the developer experience with `material-ui` and this library has been designed from the ground up with theming as a core feature.

Stylishly is **not** designed to handle dynamic property changes in style resolution. Rules are intended to be static once created, favouring traditional CSS design patterns such as switching class names. Truly dynamic properties still belong inline. This design decision combined with deterministic selector resolution allows `stylishly` to be implemented in a library and provide an interface that works for all users, whether they enjoy using JS styles themselves or are consuming the library in an application that uses a more traditional styling solution. This was a key consideration when developing a solution that would work for `material-ui`.

## Installation

```bash
npm install stylishly --save
```

## Super Basic Example

```js
import {createStyleManager} from 'stylishly/lib/styleManager';
import {createStyleSheet} from 'stylishly/lib/styleSheet';

const styleManager = createStyleManager();

const styleSheet = createStyleSheet('woof', () => ({
  meow: {
    color: 'red'
  }
}));

const classes = styleManager.render(styleSheet);


```

## Documentation

