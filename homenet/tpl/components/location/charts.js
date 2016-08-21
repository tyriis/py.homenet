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
            // get the promises for every sensor in location
            getSensors(location).then(function(sensors) {
                // array for promises
                var promises = [];
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

    // load the google charts api with area chart package
    google.charts.load('current', {'packages':['corechart']});

    /**
     * creates google charts element for sensor unit
     * @param   {object} sensor current sensor
     * @param   {object} sensorActions full json object with 24h data of specific sensor
     * @returns {object} returns rendered element
     */
    function createSensorChart(sensor, sensorActions) {
        // creates the element for the google chart
        var figure = document.createElement('figure');
        // create and populate the data table
        var sensorData = [['Time', sensor.unit]];
        for (var i = 0; i < sensorActions.length; i++) {
            var action = sensorActions[i];
            var date = action.time;
/*            var date = formatDate(action.time);*/
/*            var date = new Date(action.time);*/
            sensorData.push([date, action.value]);
        }
        // set a callback to run when the api is loaded
        google.charts.setOnLoadCallback(drawChart);

        /**
         * gets data, sets options and draws chart
         */
        function drawChart() {
            var data = google.visualization.arrayToDataTable(sensorData);
            // set chart options
            var options = {
                title: sensor.key,
                width: 600,
                height: 300,
                hAxis: {
                    title: 'Date',
                    titleTextStyle: {color: '#333'},
                    gridlines: {count: 4}
                },
                vAxis: {
                    format: '',
                    minValue: '',
                    maxValue: '',
                    gridlines: {count: 5}
                },
                legend: {position: 'none'}
            };
            // set specific options for every chart
            switch (sensor.key) {
                case 'humidity':
                    options.vAxis.format = '#\'%\'';
/*                    options.vAxis.minValue = 0;
                    options.vAxis.maxValue = 100;*/
                    options.vAxis.gridlines.count = 3;
                    break;
                case 'temperature':
                    options.vAxis.format = '# °C';
/*                    options.vAxis.minValue = -20;
                    options.vAxis.maxValue = 40;*/
                    options.vAxis.gridlines.count = 3;
                    break;
                case 'motion':
                    options.vAxis.format = '';
                    options.vAxis.gridlines.count = 2;
                    break;
                default:
                    options.vAxis.format = '';
                    options.vAxis.gridlines.count = 5;
            }
            // create and draw the visualization to element
            var chart = new google.visualization.AreaChart(figure);
            chart.draw(data, options);
        }
        // returns the chart for promise
        return figure;
    }
    
    /**
     * formats timestamp to common date for hAxis
     * @param   {number} timestamp of sensor action
     * @returns {string} returns formatted date
     */
    function formatDate(timestamp) {
        var date = new Date(timestamp);
        // hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // will display time in 10:30 format
        var formattedDate = hours + ':' + minutes.substr(-2);
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
