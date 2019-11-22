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

/**
 * Some general functions to help with requests
 */

import { makeRequest } from "./request";
import { updateFeatures as updateFeatureLayer, addFeatures  } from "@esri/arcgis-rest-feature-layer";
//import { queryFeatures } from '@esri/arcgis-rest-feature-layer';
import { request } from '@esri/arcgis-rest-request';

export function getAppConfig() {
  return new Promise((resolve, reject) => {
    makeRequest({
      url: `/config.json`,
      method: "get",
      hideCredentials: true
    }).then(resp => resolve(resp));
  });
}

export function logout(portalUrl) {
  return new Promise((resolve, reject) => {
    makeRequest({
      url: `${portalUrl}/sharing/rest/oauth2/signout`,
      handleAs: "text"
    }).then(resp => resolve(resp), error => reject(error));
  });
}


 // @_data param,  pass in the features obj from state filtered based on the OBJECTID being updated
export function updateFeatures(FeatureUrl, _data) {
  console.log("\n\tupdateFeatures()\t FeatureUrl", FeatureUrl, "\t_data\t", _data);
  let persistObj = JSON.parse(localStorage.getItem('esri_auth_id'));
  console.log("\n\tpersistObj\t ", persistObj);
  let credObj = persistObj['credentials'][0];
  let tokenObj = credObj['token'];
  
  if (_data[0].attributes['OBJECTID']) {
    console.log("updating ", _data[0].attributes['OBJECTID']);
    return new Promise((resolve, reject) => {
      //url: `${FeatureUrl}/0/updateFeatures?&token=${tokenObj}`,
      updateFeatureLayer({
        url: `${FeatureUrl}`,
        features: _data,
        httpMethod: "POST",
        params: { f: "json", token: `${tokenObj}` }
      }).then(resp => resolve(resp), error => reject(error));
    })
  }
  else{
    return new Promise((resolve, reject) => {
      //url: `${FeatureUrl}/0/updateFeatures?&token=${tokenObj}`,
      addFeatures({
        url: `${FeatureUrl}`,
        features: _data,
        httpMethod: "POST",
        params: { f: "json", token: `${tokenObj}` }
      }).then(resp => resolve(resp), error => reject(error));
    })
  }
  
}

export function getTables(tableUrl) {
  console.log("\n\ttableUrl()\t tableUrl", tableUrl);
  let persistObj = JSON.parse(localStorage.getItem('esri_auth_id'));
  let credObj = persistObj['credentials'][0];
  let tokenObj = credObj['token'];

  return new Promise ((resolve, reject) => {
    request( `${tableUrl}/query?`,{
      params: {
        httpMethod: "GET",
        outFields: "*",
        f: "json",
        where: "1=1",
        token: `${tokenObj}`,
        returnGeometry: false
      }
    }).then(resp => resolve(resp), error => reject(error));
  })
}

export function updateDomains(serviceUrl, fieldsObj) {
  console.log("\n\tupdateDomains()\t serviceUrl", serviceUrl);
  let persistObj = JSON.parse(localStorage.getItem('esri_auth_id'));
  let credObj = persistObj['credentials'][0];
  let tokenObj = credObj['token'];
  // AGOL url needs '/admin/' 
  return new Promise ((resolve, reject) => {
    request( `${serviceUrl}/updateDefinition`,{
      params: {
        httpMethod: "POST",
        f: "json",
        token: `${tokenObj}`,
        updateDefinition: `${fieldsObj}`
      }
    }).then(resp => resolve(resp), error => reject(error));
  })
}
