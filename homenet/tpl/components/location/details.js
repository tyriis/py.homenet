/* jshint browser: true */
/* jshint esnext: true */

define('components/location/details', ['ajax', 'components/location/charts'], function(ajax, charts) {
    'use strict';
    
    var chartsWrapper = document.querySelector('.charts');
    var baseUrl = "/rest/locations/%id%/sensors";
    var currentId;
    
    /**
     * makes ajax request for sensor data of specific location and builds an access point for menu, to make module loading possible
     * @param   {number} id of the current clicked location in menu
     * @returns {object} Promise
     */
    function get(id) {
        currentId = id;
        var url = baseUrl.replace('%id%', id);
        return ajax.get(url, {format: 'json'}).then(function(response) {
            return createDetails(response);
        });
    }
    
    /**
     * creates HTML element for detailview after clicking a location in main menu
     * @param   {object} response full json object with all sensor objects from current location
     * @returns {object} returns div with all elements to map data
     */
    function createDetails(response) {
        var div = document.createElement('div');
        // iterate through all sensors from current location
        for (var i = 0; i < response.length; i++) {
            var obj = response[i];
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
        var button = document.createElement('button');
        button.textContent = 'click me';
        button.addEventListener('click', clickHandler.bind(button, response));
        div.appendChild(button);
        // returns the div for Promise
        return div;
    }
    
    function renderCharts(sensors) {
        chartsWrapper.innerHTML = '';
        for (var i = 0; i < sensors.length; i++) {
            charts.get(sensors[i]).then(function(node) {
                chartsWrapper.appendChild(node);
            });
        }
    }
    
    function clickHandler(sensors, event) {
        renderCharts(sensors);
        // set chartview click event here
        // show hide (none, block)
        // render with for loop and charts.get(id)... every sensor
    }
    
    return {
        get: get
    };
    
});
