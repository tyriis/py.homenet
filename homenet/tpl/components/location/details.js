/* jshint browser: true */
/* jshint esnext: true */

define('components/location/details', ['ajax', 'components/location/charts'], function(ajax, charts) {
    'use strict';
    
    var chartsWrapper = document.querySelector('.charts');
    var baseUrl = "/rest/locations/%id%/sensors";
    var interval;
    
    /**
     * makes ajax request for sensor data of specific location and builds an access point for menu, to make module loading possible
     * @param   {number} id of the current clicked location in menu
     * @returns {object} Promise
     */
    function get(id) {
        var url = baseUrl.replace('%id%', id);
        return ajax.get(url, {format: 'json'}).then(function(sensors) {
            return createDetails(sensors);
        });
    }
    
    /**
     * creates HTML element for detailview after clicking a location in main menu
     * @param   {object} sensors full json object with all sensor objects from current location
     * @returns {object} returns div with all elements to map data
     */
    function createDetails(sensors) {
        var div = document.createElement('div');
        // iterate through all sensors from current location
        for (var i = 0; i < sensors.length; i++) {
            var obj = sensors[i];
            // create figure element and image tags
            var figure = document.createElement('figure');
            var img = document.createElement('img');
            // set specific images matching object key value
            img.src = '/images/' + obj.key + '.svg';
            var figcaption = document.createElement('figcaption');
            // create description with last value and measuring unit
            figcaption.innerHTML = obj.last_action.value + '&nbsp;' + obj.unit;
            figure.appendChild(img);
            figure.appendChild(figcaption);
            div.appendChild(figure);
        }
        // create button for displaying charts
        var button = document.createElement('button');
        button.textContent = 'click me';
        // add EventListener for charts and bind sensors to it
        button.addEventListener('click', clickHandler.bind(button, sensors));
        div.appendChild(button);
        // returns the div for Promise
        return div;
    }
    
    /**
     * draw Charts for every sensor in current location
     * @param {object} sensors current sensor object from location
     */
    function renderCharts(sensors) {
        chartsWrapper.innerHTML = '';
        for (var i = 0; i < sensors.length; i++) {
            charts.get(sensors[i]).then(function(node) {
                chartsWrapper.innerHTML += node.innerHTML;
            });
        }
    }
    
    /**
     * clickHandler for charts display button which renders charts every 10 secs
     * @param {object} sensors json, all sensors from current location
     * @param {object} event   click event
     */
    function clickHandler(sensors, event) {
        renderCharts(sensors);
        interval = setInterval(function() {
            renderCharts(sensors);
        }, 10000);
    }
    
    return {
        get: get
    };
    
});
