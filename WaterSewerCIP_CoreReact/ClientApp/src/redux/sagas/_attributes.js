import { call, takeLatest, put } from 'redux-saga/effects';
import { updateFeatures, updateDomains } from '../../services/api';
import { types as attActions } from '../reducers/attributes';

// Worker Saga:  // note: uses generator functions (special iterator functions, execute until they reach 'yield'

 // @_data param,  pass in the features obj from state filtered based on the OBJECTID being updated
 //export function updateFeatures(FeatureUrl, _data) {

function* featureUpdate(action) {
  try {
    yield call(updateFeatures, action.payload.url, action.payload.data);
    //put() is an Effect, a plain object that is fulfilled by middleware (e.g. the Saga will be 'paused' until the effect is complete)
    yield put({
      type: attActions.UPDATE_SUCCESS,
      payload: true
    });
  } catch (e) {
    console.error('SAGA ERROR: featureUpdate, ', e);
    yield put({
      type: attActions.UPDATE_FAIL,
      payload: false
    });
  }
}

function* domainUpdate(action) {
  try {
    yield call(updateDomains, action.payload.url, action.payload.data);
    //put() is an Effect, a plain object that is fulfilled by middleware (e.g. the Saga will be 'paused' until the effect is complete)
    yield put({
      type: attActions.UPDATE_SUCCESS,
      payload: true
    });
  } catch (e) {
    console.error('SAGA ERROR: domainUpdate, ', e);
    yield put({
      type: attActions.UPDATE_FAIL,
      payload: false
    });
  }
}

// Saga WATCHER //
// takeLatest does not allow concurrent fetches, it'll replace a pending fetch with the most recent
export function* watchStartAPI() {
  yield takeLatest(attActions.UPDATE_ATTRIBUTES, featureUpdate);
  yield takeLatest(attActions.UPDATE_DOMAINS, domainUpdate);
}