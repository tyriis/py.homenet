/* jshint browser: true */
/* jshint esnext: true */

define('components/location/charts', ['ajax'], function(ajax) {
    'use strict';

    var baseUrl = "/rest/sensors/%id%/actions/day";
    
    /**
     * makes ajax request for 24h sensor data of specific sensor in current location and builds an access point for details, to make module loading possible
     * @param   {number} id of current sensor in specific location
     * @returns {object} Promise
     */
    function get(sensor) {
        var url = baseUrl.replace('%id%', sensor.id);
        return ajax.get(url, {format: 'json'}).then(function(response) {
            return createCharts(response, sensor);
        });
    }
    
    // load the google charts api with area chart package
    google.charts.load('current', {'packages':['corechart']});
    /**
     * creates Google Charts element for chartview after clicking on sensor data overview in specific location
     * @param   {object} response full json object with 24h data of specific sensor
     * @returns {object} returns div with all elements to map data
     */
    function createCharts(response, sensor) {
        // creates the element for the google chart
        var figure = document.createElement('figure');
        figure.classList.add('chart');

        // create and populate the data table
        var sensorData = [['Time', sensor.unit]];
        for (var i = 0; i < response.length; i++) {
            var obj = response[i];
            var date = formatDate(obj.time);
            sensorData.push([date, obj.value]);
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
                width: '100%',
                height: '100%',
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
                    options.vAxis.minValue = 40;
                    options.vAxis.maxValue = 80;
                    options.vAxis.gridlines.count = 3;
                    break;
                case 'temperature':
                    options.vAxis.format = '# °C';
                    options.vAxis.minValue = 14;
                    options.vAxis.maxValue = 35;
                    options.vAxis.gridlines.count = 3;
                    break;
                case 'value':
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
        // returns the chart for Promise
        return figure;
    }
    
    /**
     * formats Timestamp to common date for hAxis
     * @param   {number} timestamp of sensor action
     * @returns {string} returns formatted date
     */
    function formatDate(timestamp) {
        var date = new Date(timestamp);
        // hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // will display time in 10:30:23 format
        var formattedDate = hours + ':' + minutes.substr(-2);
        return formattedDate;
    }

    return {
        get: get
    };
    
});
