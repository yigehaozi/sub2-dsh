import { createApp } from 'vue'
import '@lobehub/webfont-harmony-sans/css/index.css'
import '@lobehub/webfont-harmony-sans-sc-mini/css/index.css'

import App from './App.vue'
import { i18n } from './i18n'
import './styles.css'

createApp(App).use(i18n).mount('#app')
