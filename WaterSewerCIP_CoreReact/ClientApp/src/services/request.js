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

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    console.log(JSON.stringify(response));
    console.log(response.statusText);
    return Promise.reject(
      new Error(response.statusText)
    );
  }
}

function handleResponse(handleAs, response) {
  switch (handleAs) {
    case "text":
      return response.text();
    default:
      return response.json();
  }
}

function objectToUrlSearchParams(obj) {
  const body = new URLSearchParams();
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      body.append(prop, obj[prop]);
    }
  }

  // add f=json if not included
  if (!body.has("f")) {
    body.append("f", "json");
  }

  return body.toString();
}

function getHeaders(isFormData) {
  const headers = {};

  if (!isFormData) {
    headers["content-type"] = "application/x-www-form-urlencoded";
  }

  return new Headers(headers);
}

function getRequestBody(data, isFormData) {
  // if formdata, make formdata
  if (isFormData) {
    return this.objectToFormData(data);
  }

  // Not formdata, make url param
  return objectToUrlSearchParams(data);
}

/**
 * Make a request using fetch()
 * @param  { Object } params Object containing key/value parameters to pass to fetch()
 * @return { Promise}        Promise returned by fetch()
 */
export function makeRequest(params) {
  return new Promise((resolve, reject) => {
    let url = params.url;
    const data = params.data || {};
    const headers = getHeaders(params.isFormData);
    console.log("headers\t", JSON.stringify(headers));
    
    const options = {
      method: params.method || "get",
      headers
    };

    
    if (!params.hideCredentials) {
      options.credentials = "include";
    }
    var body = {};
    //body['token']=params.token;
    if (params.features) {
      body['features'] = params.features
      options.body = JSON.stringify(body);
      headers['Authorization'] = `token ${params.token}`;
      options['token']=params.token;
    } else {
      body = getRequestBody(data, params.isFormData);
      if (options.method === "get") {
        url = `${url}?${body}`;
      } else {
        options.body = body;
      }
    }
    
    options['authMode']="immediate";
    console.log("url \t", url,"\n\t options", options);
    //fetch(url, options)
    fetch(url, options)
      .then(status)
      .then(handleResponse.bind(null, params.handleAs))
      .then(function(data) {
        // Handle successful requests that are actually errors...
        console.log("fetch() handle response\n\t", JSON.stringify(data));
        if (data.error) {
          reject(data.error);
          return;
        }
        resolve(data);
      })
      .catch(function(error) {
        console.log("makeRequest error\n\t", JSON.stringify(error));
        reject(error);
      });
  });
}
