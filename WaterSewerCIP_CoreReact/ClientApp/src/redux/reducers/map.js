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

// ACTION TYPES //
export const types = {
  MAP_LOADED: "MAP_LOADED",
  SET_FEATURES: "SET_FEATURES",
  /* SET_FILTER: "SET_FILTER",
  APPLY_FILTER: "APPLY_FILTER", */
  TOGGLE_ATTRIBUTES: "TOGGLE_ATTRIBUTES",
  SET_FIELDS: "SET_FIELDS",
  SELECT_FEATURE: "SELECT_FEATURE",
  SET_CONTRACTORS: "SET_CONTRACTORS",
  SET_EMPLOYEES: "SET_EMPLOYEES",
  UPDATE_CONTRACTORS: "SET_CONTRACTORS",
  UPDATE_EMPLOYEES: "SET_EMPLOYEES",
  GET_CONTRACTORS : "GET_CONTRACTORS",
  GET_EMPLOYEES : "GET_EMPLOYEES",
};

// REDUCERS //
export const initialState = {
  loaded: false,
  features: [],
  managers: [],
  statuses: [],
  years:[],
  featureLayer:{},
  defExp: "",
  fields:[{}],
  domains: [{}],
  selectedFeature:{},
  contractors: [],
  employees: [{}],
  attributesComponent: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.MAP_LOADED:
      return {
        ...state,
        loaded: true
      };
    case types.SET_CONTRACTORS:
      //console.log("set contractors: " + JSON.stringify(action));
      return {
        ...state,
        contractors: action.payload
      };
    case types.SET_EMPLOYEES:
      //console.log("set employees: " + JSON.stringify(action));
      if (action.payload.adjust){
        console.log("set employees action.payload.data: " + JSON.stringify(action.payload.employees));
        var employees = action.payload.employees.map( (emp) => {
          return {'attributes' : emp};
        });
        return {
          ...state,
          employees: {
            'features': employees,
            'fields': state.employees.fields,
            'globalIdFieldName' : state.employees.globalIdFieldName,
            'objectIdFieldName' : state.employees.objectIdFieldName,
            'uniqueIdField' : state.employees.uniqueIdField,
          }
        }
      }
      return {
        ...state,
        employees: action.payload
      };
    case types.SET_FEATURES:
      //console.log("set features: " + JSON.stringify(action));
      var _stat = [...new Set(action.payload.features.map(feature => feature.attributes.Status ||"null"))];
      //console.log("set features _stat: " + JSON.stringify(_stat));
      _stat.push("All Statuses");
      var _years= [...new Set(action.payload.features.map(feature => feature.attributes.Proposed_Year || "null"))];
      _years.push("All Years");
      var _managers= [...new Set(action.payload.features.map(feature => feature.attributes.Project_Manager || "null"))];
      _managers.push("All Managers");
      return {
        ...state,
        features: action.payload.features,
        statuses: _stat.sort(),
        years: _years.sort(),
        managers: _managers.sort()
      };
    case types.SET_FIELDS:
      //console.log("set FIELDS payload: " + JSON.stringify(action.payload));
      return {
        ...state,
        fields: action.payload.fields
      };
    // case types.APPLY_FILTER:
    //   //console.log("apply filter: " + JSON.stringify(action.payload));
    //   return {
    //     ...state,
    //     //filter: "OBJECTID > 0 & " + action.payload
    //   };
    case types.TOGGLE_ATTRIBUTES:
      //console.log("TOGGLE_ATTRIBUTES: " + JSON.stringify(action));
      return {
        ...state,
        attributesComponent: !state.attributesComponent
      };
    case types.SELECT_FEATURE:
      
      if (action.payload['feature'] !== undefined && action.payload['feature'] !== null){
        console.log("SELECT_FEATURE: " + JSON.stringify(action.payload));
        console.log("\tFEATURE: " + action.payload['feature']);
        return {
          ...state,
          selectedFeature: action.payload['feature']
        };
      }
      else {
        return {
          ...state,
          selectedFeature: action.payload
        };
      }   
    default:
      return state;
  }
};

// ACTION CREATORS //
export const actions = {
  mapLoaded: () => ({
    type: types.MAP_LOADED,
    payload: {}
  }),
  setFeatures: features => ({
    type: types.SET_FEATURES,
    payload: {
      features
    }
  }),
  selectFeature: feature => ({
    type: types.SELECT_FEATURE,
    payload: {
      feature
    }
  }),
  setFields: fields => ({
    type: types.SET_FIELDS,
    payload: {
      fields
    }
  }),
  // setFilter: filter => ({
  //   type: types.SET_FILTER,
  //   payload: {
  //     filter
  //   }
  // }),
  // applyFilter: filter => ({
  //   type: types.APPLY_FILTER,
  //   payload: {
  //     filter
  //   }
  // }),
  toggleAttributes: () => ({
    type: types.TOGGLE_ATTRIBUTES,
    payload: {}
  }),
  getContractors: (tableUrl) => ({
    type: types.GET_CONTRACTORS,
    payload: {
      url: tableUrl
    }
  }),
  getEmployees: (tableUrl) => ({ //triggers a saga, then SET_EMPLOYEES action
    type: types.GET_EMPLOYEES,
    payload: {
      url: tableUrl
    }
  }),
  setEmployees: (_employees, _adjust=false) => ({
    type: types.SET_EMPLOYEES,
    payload: {
      employees: _employees,
      adjust: _adjust
    }
  })
};
