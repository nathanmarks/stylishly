# stylishly-at-rules

**Note:** This package requires `stylishly-nested` to work properly.

## Media Queries

```js
const styleSheet = createStyleSheet('Ocean', () => ({
  '@media (min-width: 800px)': {
    titanic: {
      float: 'left',
    },
  },
}));
```

Nested Syntax

```js
const styleSheet = createStyleSheet('Ocean', () => ({
  titanic: {
    '@media (min-width: 800px)': {
      float: 'left',
    },
  },
}));
```

## Keyframes

```js
const styleSheet = createStyleSheet('Ocean', () => ({
  titanic: {
    animation: 'sink 9600s',
  },
  '@keyframes sink': {
    '0%': {
      transform: 'translateY(0)',
    },
    '100%': {
      transform: 'translateY(-30000)',
    },
  },
}));
```

