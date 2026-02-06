import vuePlugin from 'eslint-plugin-vue'
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...vuePlugin.configs['flat/recommended'],
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        URLSearchParams: 'readonly',
        URL: 'readonly',
        Image: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        WebSocket: 'readonly',
        TextEncoder: 'readonly',
        crypto: 'readonly',
        btoa: 'readonly',
        atob: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      quotes: ['warn', 'single', { avoidEscape: true }],
      semi: ['warn', 'never'],
      'comma-dangle': ['error', 'never'],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off'
    }
  }
]
