import { render } from 'lit';
// @ts-ignore: side-effect import for CSS handled by Vite
import './styles.css';
import './app/app-root';

const root = document.querySelector('#app');
if (!root) {
    throw new Error('Could not find #app in DOM');
}

render(null, root);