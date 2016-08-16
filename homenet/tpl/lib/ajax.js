/* from david walsh: https://davidwalsh.name/promises */
/*
    ajax._METHOD_('url', {data: bla, format: 'json'}).then(function(response) {
        console.log('Success!', response);
    }, function(error) {
        console.error('Failed!', error);
    });
*/

/* jshint browser: true */
/* jshint esnext: true */

// define module('module name', ['dependency 1, 2..'], function...)
define('ajax', [], function() {
    'use strict';

    // default parameters
    var defaults = {
        method: null,
        url: null,
        format: null,
        data: null
    };

    /**
     * merge default object with passed params object
     * @private
     * @param   {string} url        url for ajax request
     * @param   {object} [params={] specific params for the request, ie format, data etc.
     * @returns {object} returns ready params object for further processing
     */
    function _merge(url, params) {
        // sets passed params object in variable or creates empty params object
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

    /**
     * wrapper! set function for every ajax method. first merge objects, then set method and return promise
     * @param   {string} url    url for ajax request
     * @param   {object} params merged params object
     * @returns {object} returns the promise
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

    /**
     * one and only promise for processing ajax request. checks format and sets specific headers, handle errors and sends request
     * @private
     * @param   {object} params merged params object
     * @returns {object} returns the promise
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
    
    // return wrapper functions and make them available in required scope
    return {
        get: get,
        post: post,
        put: put,
        delete: del
    };
});