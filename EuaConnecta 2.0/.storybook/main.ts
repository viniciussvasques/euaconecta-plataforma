import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-storysource',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop: { parent?: { fileName: string } }) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  staticDirs: ['../public'],
  webpackFinal: async (config: Record<string, unknown>) => {
    // Add path aliases
    if (config.resolve && typeof config.resolve === 'object') {
      (config.resolve as Record<string, unknown>).alias = {
        ...((config.resolve as Record<string, unknown>).alias as Record<string, string>),
        '@': path.resolve(__dirname, '../src'),
        '@shared': path.resolve(__dirname, '../src/shared'),
        '@modules': path.resolve(__dirname, '../src/modules'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@hooks': path.resolve(__dirname, '../src/hooks'),
        '@utils': path.resolve(__dirname, '../src/shared/utils'),
        '@types': path.resolve(__dirname, '../src/types'),
      };
    }

    return config;
  },
};

export default config;