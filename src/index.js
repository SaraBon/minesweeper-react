import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Minesweeper from './App';
import * as serviceWorker from './serviceWorker';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBomb, faFlagCheckered, faFrown, faSmile } from '@fortawesome/free-solid-svg-icons'
library.add(faBomb, faFlagCheckered, faFrown, faSmile)


ReactDOM.render(<Minesweeper />, document.getElementById('root'));

serviceWorker.unregister();
