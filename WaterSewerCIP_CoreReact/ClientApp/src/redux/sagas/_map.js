import { call, put, takeLatest } from 'redux-saga/effects';
//getTables(FeatureUrl, _layerID)
import { getTables } from '../../services/api'; 
import { types as mapActions } from '../reducers/map';

// Worker Saga:  // note: uses generator functions (special iterator functions, execute until they reach 'yield'

 // @_data param,  pass in the features obj from state filtered based on the OBJECTID being updated
 //export function updateFeatures(FeatureUrl, _data) {

function* getContractors(action) {
    console.log("\n\ngetContractors action: ", JSON.stringify(action))
    try {
        const contractors = yield call(getTables, action.payload.url);
        //put() is an Effect, a plain object that is fulfilled by middleware (e.g. the Saga will be 'paused' until the effect is complete)
        console.log("\n\tgetTables resp: ", JSON.stringify(contractors))
        yield put({
            type: mapActions.SET_CONTRACTORS,
            payload: contractors
        });
    } catch (e) {
        console.error('SAGA ERROR: getContractors, ', e);
    }
}
function* getEmployees(action) {
    console.log("\n\ngetEmployees action: ", JSON.stringify(action))
    try {
        const employees = yield call(getTables, action.payload.url);
        console.log("\n\tgetTables resp: ", JSON.stringify(employees))
        //put() is an Effect, a plain object that is fulfilled by middleware (e.g. the Saga will be 'paused' until the effect is complete)
        yield put({
            type: mapActions.SET_EMPLOYEES,
            payload: employees
        });
    } catch (e) {
        console.error('SAGA ERROR: getEmployees, ', e);
    }
}

// Saga WATCHER //
// takeLatest does not allow concurrent fetches, it'll replace a pending fetch with the most recent
export function* watchStartAPI() {
    yield takeLatest(mapActions.GET_CONTRACTORS, getContractors);
    yield takeLatest(mapActions.GET_EMPLOYEES, getEmployees);
}
