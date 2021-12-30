import { makeTheme } from 'dripsy';

const colors = {
  $primary: '#6200EE',
  $primaryVariant: '#3700B3',
  $secondary: '#03DAC6',
  $secondaryVariant: '#018786',
  $background: '#FFFFFF',
  $surface: '#FFFFFF',
  $error: '#B00020',
  $onPrimary: '#FFFFFF',
  $onSecondary: '#000000',
  $onBackground: '#000000',
  $onSurface: '#000000',
  $onError: '#FFFFFF',
  $disable: '#F5F7F9',
};

const space = {
  $0: 0,
  $1: 2,
  $2: 4,
  $3: 8,
  $4: 12,
  $5: 16,
  $6: 24,
  $7: 32,
  $8: 64,
  $9: 128,
  $10: 256,
};

const fontSizes = {
  $0: 12,
  $1: 14,
  $2: 16,
  $3: 18,
  $4: 24,
  $5: 28,
  $6: 32,
};

const text = {
  h1: {
    fontSize: '$2',
  },
  h2: {
    marginY: '$4',
    fontSize: ['$4', '$4', '$5'],
  },
  h3: {
    marginY: '$3',
    fontSize: ['$3', '$3', '$4'],
  },
  h4: {
    marginY: '$0',
    fontWeight: '600',
    fontSize: ['$2', '$2', '$3'],
  },
  h5: {
    marginY: '$0',
    fontWeight: ['400', '500', '500'],
    fontSize: ['$1', '$1', '$2'],
  },
  p: {
    fontSize: '$0',
  },
};

const linearGradients = {
  sunny: ['red', 'orange'],
};

const theme = makeTheme({
  colors,
  space,
  fontSizes,
  text,
  linearGradients,
});

type MyTheme = typeof theme;
declare module 'dripsy' {
  // @ts-expect-error: Don't have time to inspect why it bothers when editing `h2`.
  interface DripsyCustomTheme extends MyTheme {}
}

export default theme;
