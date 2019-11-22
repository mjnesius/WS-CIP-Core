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

import { call, put, takeLatest } from 'redux-saga/effects';
import { getAppConfig } from '../../services/api';
import { types as configTypes } from '../reducers/config';
//import myConfig from '../../config';

// Worker Saga: gets fired with SET_CONFIG // note: uses generator functions (special iterator functions, execute until they reach 'yield'
function* fetchConfig (action) {
    try {
        // call API to fetch config
        const config = yield call(getAppConfig);
        //var configPath = 'json!./config.json';
        //var myConfig = require(configPath);
        //console.log(JSON.stringify(myConfig));
        // Put config in store
        yield put({
            type: configTypes.SET_CONFIG,
            payload: config
        });

    } catch (e) {
        console.log('SAGA ERROR: config/fetchConfig, ', e);
    }
}

// WATCHER: gets tied into Redux via createStore() using applyMiddleware() //
export function* watchFetchConfig() {
    yield takeLatest(configTypes.CONFIG_FETCH, fetchConfig);
}
