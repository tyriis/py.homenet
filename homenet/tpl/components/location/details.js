/* jshint browser: true */
/* jshint esnext: true */

define('components/location/details', ['ajax'], function(ajax) {
    'use strict';

    var baseUrl = "/rest/locations/%id%/sensors";
    var node = document.createElement('div');
    node.classList.add('details');
    var timeout;
    
    /**
     * creates details element for 24h view and sets timeout 10 sec for refresh
     * @param   {object}  location gets current location
     * @param   {boolean} update   if call by timeout, update true
     * @returns {object}  promise
     */
    function create(location, update) {
        // if update param is false, clear div
        if (!update) {
            node.innerHTML = '';
        }
        var url = baseUrl.replace('%id%', location.id);
        return ajax.get(url).then(function(sensors) {
            // clear node
            node.innerHTML = '';
            // iterate through all sensors from current location
            for (var i = 0; i < sensors.length; i++) {
                node.appendChild(createSensorDetail(sensors[i]));
            }
            // set timeout of 10 secs for refresh
            timeout = setTimeout(function() {
                create(location, true);
            }, 10*1000);
        });
    }
    
    /**
     * creates HTML Element for sensor unit
     * @param   {object} sensor full json object with all sensor objects from current location
     * @returns {object} returns rendered element
     */
    function createSensorDetail(sensor) {
        // create figure element and image tags
        var figure = document.createElement('figure');
        var img = document.createElement('img');
        // set specific images matching object key value
        img.src = '/images/' + sensor.key + '.svg';
        var figcaption = document.createElement('figcaption');
        // create description with last value and measuring unit
        figcaption.innerHTML = sensor.last_action.value + '&nbsp;' + sensor.unit;
        // append them all
        figure.appendChild(img);
        figure.appendChild(figcaption);
        // returns the div for Promise
        return figure;
    }
    
    /**
     * clears timeout and removes charts element from dom
     */
    function remove() {
        clearTimeout(timeout);
        // remove only if node is appended to dom
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    
    return {
        create: create,
        node: node,
        remove: remove
    };
    
});
