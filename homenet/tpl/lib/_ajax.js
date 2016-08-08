/* jshint browser: true */
/* jshint esnext: true */
/* from david walsh: https://davidwalsh.name/promises */

(function(window) {
    'use strict';

    // make it available in global scope
    window.ajax = {
        get: get,
        post: post,
        put: put,
        delete: del
    };

    // default object
    var defaults = {
        method: null,
        url: null,
        format: null,
        data: null
    };

    // merge default object with passed params object
    function _merge(url, params) {
        // create empty params object
        params = params || {};
        // if first param is string url, get value. else get value from object
        if (typeof(url) === "string") {
            params.url = url;
        } else {
            params = url;
        }
        // merge every key from params and defaults object
        for (var key in defaults) {
            if (params[key] === undefined) {
                params[key] = defaults[key];
            }
        }
        // set params.format to lowercase (prevent unmatched input)
        if (params.format) {
            params.format = params.format.toLowerCase();
        }
        return params;
    }

    /*
        set function for every ajax method.
        first merge objects, then set method and return promise
    */
    function get(url, params) {
        params = _merge(url, params);
        params.method = 'GET';
        return _request(params);
    }

    function post(url, params) {
        params = _merge(url, params);
        params.method = 'POST';
        return _request(params);
    }

    function put(url, params) {
        params = _merge(url, params);
        params.method = 'PUT';
        return _request(params);
    }

    function del(url, params) {
        params = _merge(url, params);
        params.method = 'DELETE';
        return _request(params);
    }

    /*
        ajax promise

    */
    function _request(params) {
        // new promise
        return new Promise(function(resolve, reject) {
            // xhr request
            var xhr = new XMLHttpRequest();
            // check if params.url is not empty
            if (!params.url) {
                return reject(Error('request url is empty'));
            }
            // TODO: URLencode GET data if params.data.

            // open request and get method and url
            xhr.open(params.method, params.url);
            // if format json, set request header to accept only json
            if (params.format === 'json') {
                xhr.setRequestHeader('Accept', 'json');
                // if method is get, set content type request header
                if (params.method !== 'GET') {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                }
            }

            // do, when xhr loaded
            xhr.onload = function() {
                // check status ok
                if (xhr.status !== 200) {
                    // if not okay, reject promise
                    return reject(Error(xhr.statusText));
                }
                // if okay and format is json, parse it, resolve promise and return data
                if (params.format === 'json') {
                    return resolve(JSON.parse(xhr.responseText));
                }
                // if okay, but no json, resolve promise and return data
                return resolve(xhr.response);
            };

            // handle network errors
            xhr.onerror = function() {
                reject(Error('Network Error'));
            };

            // make the request, optional stringify json data before send
           xhr.send(JSON.stringify(params.data));
        });
    }

    /*


    ajax._METHOD_('url', {data: bla, format: 'json'}).then(function(response) {
        console.log('Success!', response);
    }, function(error) {
        console.error('Failed!', error);
    });
    */
})(window);
