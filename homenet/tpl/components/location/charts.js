/* jshint browser: true */
/* jshint esnext: true */

define('components/location/charts', ['ajax'], function(ajax) {
    'use strict';

    var baseUrl = "/rest/sensors/%id%/actions/day";
    var sensorUrl = "/rest/locations/%id%/sensors";
    var node = document.createElement('div');
    node.classList.add('charts');
    var timeout;
    
    /**
     * creates charts element for 24h view and sets timeout 60 sec for refresh
     * @param   {object}  location gets current location
     * @param   {boolean} update   if call by timeout, update true
     * @returns {object}  promise
     */
    function create(location, update) {
        // if update param is false, clear div
        if (!update) {
            node.innerHTML = '';
        }
        return new Promise(function(resolve) {
            // request all sensors from current location
            getSensors(location).then(function(sensors) {
                // array for dayData promises, so a refresh is possible without visible rendering. it waits with rendering till all promises are collected and then appends them at once
                var promises = [];
                // request dayData from every sensor and push it to promises array
                for (var i = 0; i < sensors.length; i++) {
                    var url = baseUrl.replace('%id%', sensors[i].id);
                    promises.push(ajax.get(url));
                }
                // handle all collected promises at once
                Promise.all(promises).then(function(all) {
                    // clear node
                    node.innerHTML = '';
                    // append all charts
                    for (var i = 0; i < all.length; i++) {
                        node.appendChild(createSensorChart(sensors[i], all[i]));
                    }
                    // set timeout of 60 secs for refresh
                    timeout = setTimeout(function() {
                        create(location, true);
                    }, 60*1000);
                    resolve();
                });
            });
        });
    }
    
    /**
     * gets all sensors from current location
     * @param   {object} location current location
     * @returns {object} promise
     */
    function getSensors(location) {
        var url = sensorUrl.replace('%id%', location.id);
        return ajax.get(url);
    }

    // load the google charts api with area and timeline chart packages
    google.charts.load('current', {'packages':['corechart']});

    /**
     * creates google charts element for sensor unit
     * @param   {object} sensor         current sensor
     * @param   {object} sensorActions  full json object with 24h data of specific sensor
     * @returns {object} returns rendered element
     */
    function createSensorChart(sensor, sensorActions) {
        // get current date and date 24h ago for fixing empty values at the begining or end of the rendered chart
        var endDate = new Date();
        var startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()-1, endDate.getHours(), endDate.getMinutes());
        // create container for centering google charts properly
        var div = document.createElement('div');
        div.classList.add('chart');
        var h3 = document.createElement('h3');
        h3.innerHTML = sensor.key;
        div.appendChild(h3);
        // creates the element for every google chart
        var figure = document.createElement('figure');
        // creates sensor data for chart
        var sensorData = prepareData(sensor, sensorActions, startDate, endDate);

        // set a callback to run when the api is loaded
        google.charts.setOnLoadCallback(drawChart);

        /**
         * gets data, sets options and draws chart
         */
        function drawChart() {
            var data = google.visualization.arrayToDataTable(sensorData);
            // set chart options for area chart
            var options = {
                width: 350,
                height: 175,
                hAxis: {
                    titleTextStyle: {
                        color: '#333'
                    },
                    slantedText: false,
                    viewWindow: {
                        min: startDate,
                        max: endDate
                    },
                    gridlines: {
                        // set to austrian time, buggy :>
                        count: -1,
                        units: {
                          days: {format: ['MMM dd']},
                          hours: {format: ['HH:mm']},
                        }
                    },
                },
                vAxis: {
                    gridlines: {
                        count: 5
                    }
                },
                legend: {position: 'none'},
            };
            // set specific options for every chart
            switch (sensor.key) {
                case 'humidity':
                    options.colors = ['#536DFE'];
                    options.vAxis.format = '#\'%\'';
                    options.vAxis.gridlines.count = 3;
                    break;
                case 'temperature':
                    options.colors = ['#FF5252'];
                    options.vAxis.format = '# °C';
                    options.vAxis.maxValue = 30;
                    options.vAxis.gridlines.count = 3;
                    break;
                case 'motion':
                    //options.colors = ['#F44336'];
                    options.colors = ['#FFC107'];
                    options.vAxis.gridlines.count = 2;
                    break;
            }
            // create and draw the visualization to element
            var chart = new google.visualization.AreaChart(figure);

            chart.draw(data, options);
        }
        // append to container
        div.appendChild(figure);
        // returns the chart for promise
        return div;
    }
    
    /**
     * prepares Data model for google charts api, injects fake actions for better rendering
     * @param   {object} sensor        current sensor
     * @param   {object} sensorActions current sensor actions
     * @param   {object} startDate     current date - 24 h
     * @param   {object} endDate       current date
     * @returns {object} returns data model for google charts array method
     */
    function prepareData(sensor, sensorActions, startDate, endDate) {
        // create data model for area charts
        var data = [['Time', sensor.key]];
        // for every sensor action in the last 24h
        for (var i = 0; i < sensorActions.length; i++) {
            var action = sensorActions[i];
            // inject fake action at first position of google chart, to avoid broken chart with no values at the beginning
            if (i === 0) {
                // if motion and first action value is 1, inject 0 to array
                if (sensor.unit === 'motion' && action.value) {
                    data.push([startDate, 0]);
                } else {
                    // inject first available value on first position
                    data.push([startDate, action.value]);
                }
            }
            // inject fake 0 value before every motion action value with 1 to avoid broken chart with diagonal lines
            if (sensor.unit === 'motion') {
                if (action.value) {
                    data.push([new Date(action.time), 0]);
                }
            }
            // now push all available sensor actions chronological
            data.push([new Date(action.time), action.value]);
            // finally, at last position of google chart inject last known action value to avoid broken chart with no values at the end
            if (i === sensorActions.length - 1) {
                data.push([endDate, action.value]);
            }
        }
        return data;
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
