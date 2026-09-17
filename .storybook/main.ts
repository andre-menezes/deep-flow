import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath, URL } from 'node:url'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/shared/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-links'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('../src', import.meta.url)),
        },
      },
    })
  },
}

export default config
