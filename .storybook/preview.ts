import type { Preview } from '@storybook/vue3'
import '../src/shared/styles/main.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      description: 'Studia color scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = (context.globals.theme as string) ?? 'light'
      document.documentElement.classList.toggle('dark', theme === 'dark')
      return {
        components: { story },
        template: `
          <div class="min-h-[50vh] w-full bg-background p-8 text-foreground">
            <story />
          </div>
        `,
      }
    },
  ],
}

export default preview
