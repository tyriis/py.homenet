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
        // create container for elements
        var div = document.createElement('div');
        div.classList.add('sensorDetails');

        // create header
        var h3 = document.createElement('h3');
        h3.innerHTML = sensor.key;
        div.appendChild(h3);

        // create container for current value and append
        var current = document.createElement('div');
        current.classList.add('current');
        div.appendChild(current);

        // create current title and append
        var currentTitle = document.createElement('div');
        currentTitle.classList.add('title');
        currentTitle.innerHTML = 'current';
        current.appendChild(currentTitle);

        // create current value and append
        var currentValue = document.createElement('div');
        currentValue.classList.add('value');
        var value = sensor.last_action.value;
        // if sensor is motion
        if (sensor.key === 'motion') {
            // set value to '', when 1, else 'no'
            value = (value) ? '' : 'no';
        }
        currentValue.innerHTML = value  + ' ' + sensor.unit;
        current.appendChild(currentValue);

        // create container for last action value and append
        var lastAction = document.createElement('div');
        lastAction.classList.add('lastAction');
        div.appendChild(lastAction);

        // create last action title and append
        var lastActionTitle = document.createElement('div');
        lastActionTitle.classList.add('title');
        lastActionTitle.innerHTML = 'last action';
        lastAction.appendChild(lastActionTitle);

        // create last action value and append
        var lastActionValue = document.createElement('div');
        lastActionValue.classList.add('value');
        var time = formatDate(sensor.last_action.time);
        lastActionValue.innerHTML = time;
        lastAction.appendChild(lastActionValue);

        var svgImageBorder = document.createElement('div');
        svgImageBorder.classList.add('svgImageBorder');
        svgImageBorder.classList.add(sensor.key);

        // create image and append
        var svgImage = document.createElement('div');
        svgImage.classList.add('svgImage');
        
        svgImageBorder.appendChild(svgImage);
        div.appendChild(svgImageBorder);

        // returns the div for Promise
        return div;
    }

    /**
     * format timestamp of last action value
     * from stackoverflow
     * @param   {number} timestamp of last sensor action
     * @returns {string} formatted date hh:mm
     */
    function formatDate(timestamp) {
        var date = new Date(timestamp);
        // hours part from timestamp
        var hours = date.getHours();
        // minutes part from timestamp
        var minutes = '0' + date.getMinutes();
        // seconds part from timestamp
        var seconds = '0' + date.getSeconds();
        // display time in 10:30 format
        var formattedDate = hours + ':' + minutes.substr(-2) + ':' +  seconds.substr(-2);
        return formattedDate;
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
