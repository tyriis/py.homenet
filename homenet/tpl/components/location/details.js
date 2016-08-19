/* jshint browser: true */
/* jshint esnext: true */

define('components/location/details', ['ajax', 'components/location/charts'], function(ajax, charts) {
    'use strict';

    var baseUrl = "/rest/locations/%id%/sensors";
/*    var interval;*/
    
    /**
     * makes ajax request for sensor data of specific location and builds an access point for menu, to make module loading possible
     * @param   {number} id of the current clicked location in menu
     * @returns {object} Promise
     */
    function render(id) {
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
        // creates container for detail view
        var detailsDiv = document.createElement('div');
        detailsDiv.classList.add('details');
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
            // append them all
            figure.appendChild(img);
            figure.appendChild(figcaption);
            detailsDiv.appendChild(figure);
        }
/*        // create button for displaying charts
        var button = document.createElement('button');
        button.textContent = 'click me';
        // add EventListener for charts and bind sensors to it
        button.addEventListener('click', clickHandler.bind(button, sensors, currLi, div));
        div.appendChild(button);*/
        // create EventListener to details for displaying charts, bind sensors, current active menupoint and details element to it
/*        detailsDiv.addEventListener('click', clickHandler.bind(detailsDiv, sensors, currLi, detailsDiv));
        */
        // returns the div for Promise
        return detailsDiv;
    }
    
    /**
     * clickHandler for charts display button which renders charts every 30 secs
     * @param {object} sensors json, all sensors from current location
     * @param {object} event   click event
     */
/*    function clickHandler(sensors, currLi, detailsDiv) {
        renderCharts(sensors, currLi, detailsDiv);
        // set interval for redraw with new values
        interval = setInterval(function() {
            renderCharts(sensors, currLi, detailsDiv);
        }, 30*1000);
    }*/

    /**
     * first collect all solved promises, then draw charts for every sensor in current location
     * @param {object} sensors current sensor object from location
     */
 /*   function renderCharts(sensors, currLi, detailsDiv) {
        var chartsDiv = document.createElement('div');
        chartsDiv.classList.add('.charts');
        // array for promises
        var promises = [];
        // get the promises for every sensor in location
        for (var i = 0; i < sensors.length; i++) {
            promises.push(charts.get(sensors[i]));
        }
        // handle all collected promises at once
        Promise.all(promises).then(function(all) {
            // append all returned nodes of the promises in chartwrapper
            for (var i = 0; i < all.length; i++) {
                chartsDiv.appendChild(all[i]);
            }
            currLi.removeChild(currLi.detailsDiv);
            currLi.appendChild(chartsDiv);
        });
    }*/
    
    return {
        render: render
    };
    
});
