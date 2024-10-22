const config = require('./tailwind.config');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],

  theme: config.theme,

  corePlugins: {
    backdropOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
    textOpacity: false,
  },
};
