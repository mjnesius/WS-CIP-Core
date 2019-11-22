// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

// React //
import React from 'react';
import ReactDOM from 'react-dom';

// Redux //
import { Provider } from 'react-redux';
import { initStore } from './redux/store';
import {StoreContext} from './components/StoreContext';

// React Router //
import { BrowserRouter, Route } from 'react-router-dom';

// Components //
import { homepage } from '../package.json';
import App from './App';
//import FilterComponent from './components/Filters';
// Styles //
import CalciteThemeProvider,{ CalciteTheme } from 'calcite-react/CalciteThemeProvider';
import { GlobalStyle } from './styles/global';
import './styles/fonts.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// COT navy cmyk: 100, 57, 0, 40 // rgb 0, 66, 153
const COTtheme = {
  ...CalciteTheme,
  palette: {
    ...CalciteTheme.palette,
    cotBlue: '#004299',
    cotTransparaent: 'rgba(0, 66, 153, 0.8)'
  }
};

// App runs at the root locally, but under /{homepage} in production
let basename;
process.env.NODE_ENV !== 'production' ? (basename = '') : (basename = homepage);

// Create Redux Store
export const store = initStore();

// App entry point
ReactDOM.render(
  <Provider store={store} context={StoreContext}>
      <BrowserRouter basename={basename}>
        <CalciteThemeProvider theme={COTtheme}>
          <GlobalStyle />
          <Route path='/' component={App} />
          
        </CalciteThemeProvider>
      </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
