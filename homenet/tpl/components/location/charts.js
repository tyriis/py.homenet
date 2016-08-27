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
    google.charts.load('current', {'packages':['corechart', 'timeline']});

    /**
     * creates google charts element for sensor unit
     * @param   {object} sensor current sensor
     * @param   {object} sensorActions full json object with 24h data of specific sensor
     * @returns {object} returns rendered element
     */
    function createSensorChart(sensor, sensorActions) {
        var endDate = new Date();
        var startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()-1, endDate.getHours(), endDate.getMinutes());
        // create container for centering google chart
        var div = document.createElement('div');
        div.classList.add('chart');
        // creates the element for the google chart
        var figure = document.createElement('figure');
        var sensorData = prepareData(sensor, sensorActions, startDate, endDate);
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
                titleTextStyle: {
                    fontName: 'Roboto',
                    fontSize: 14
                },
/*                tooltip: {
                    isHtml: true
                },*/
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
            var gChart;
            // set specific options for every chart
            switch (sensor.key) {
                case 'humidity':
                    gChart = 'AreaChart';
                    options.colors = ['#009688'];
                    options.vAxis.format = '#\'%\'';
                    //options.vAxis.minValue = 0;
                    //options.vAxis.maxValue = 100;
                    options.vAxis.gridlines.count = 3;
                    break;
                case 'temperature':
                    gChart = 'AreaChart';
                    options.colors = ['#303F9F'];
                    options.vAxis.format = '# °C';
                    //options.vAxis.minValue = -20;
                    options.vAxis.maxValue = 30;
                    options.vAxis.gridlines.count = 3;
                    break;
                case 'motion':
                    gChart = 'Timeline';
                    //options.colors = ['#F44336'];
                    //options.vAxis.gridlines.count = 2;
                    break;
            }
            // create and draw the visualization to element
            var chart = new google.visualization[gChart](figure);
            chart.draw(data, options);
        }
        // append to container
        div.appendChild(figure);
        // returns the chart for promise
        return div;
    }
    
    function prepareData(sensor, sensorActions, startDate, endDate) {
        var data;
        var action;
        var i;
        if (sensor.unit === 'motion') {
            // create exeption for motion sensor, timeline need specific data model
            data = [['Motion', 'start', 'end']];

            for (i = 0; i < sensorActions.length; i++) {
                action = sensorActions[i];
                // if action value is 0, skip it for timeline rendering
                if (action.value === 0) {
                    continue;
                }
                var nextAction = sensorActions[i + 1];
                // if there is no next action, skip
                if (!nextAction) {
                    continue;
                }
                console.log(new Date(action.time), new Date(nextAction.time));
                data.push([sensor.key, new Date(action.time), new Date(nextAction.time)]);
            }
        } else {
            // create data model for area charts
            data = [['Time', sensor.key]];
            for (i = 0; i < sensorActions.length; i++) {
                action = sensorActions[i];
                if (i === 0) {
                    // inject fake action at first position of google chart, to make sure the chart is not broken if there are no values over time
                    data.push([startDate, action.value]);
                }
                data.push([new Date(action.time), action.value]);
                if (i === sensorActions.length - 1) {
                    data.push([endDate, action.value]);
                }
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
