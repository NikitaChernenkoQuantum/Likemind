import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'


import configureStore from './store/configureStore'
import './styles/app.css';
import 'antd/dist/antd.css'

import Routes from './routers'

const store = configureStore();

ReactDOM.render(
	<Provider store={store}>
		<Routes/>
	</Provider>,
	document.getElementById('root')	
);

