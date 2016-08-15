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
    
    // load the visualisation api and the line chart package
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
        var sensorData = [['Time', sensor.unit]];
        for (var i = 0; i < response.length; i++) {
            var obj = response[i];
            sensorData.push([new Date(obj.time), obj.value]);
        }
        // set a callback to run when the api is loaded
        google.charts.setOnLoadCallback(drawChart);
        // callback that creates the data table, initialises the line chart, passes the data and draws it
        function drawChart() {
            var data = google.visualization.arrayToDataTable(sensorData);
            // set chart options
            var options = {
              title: sensor.key,
              hAxis: {title: 'Hours',  titleTextStyle: {color: '#333'}},
              vAxis: {minValue: 0}
            };
            // initialize the chart and pass some options
            var chart = new google.visualization.AreaChart(figure);
            chart.draw(data, options);
        }
        // returns the chart for Promise
        return figure;
    }
    
    return {
        get: get
    };
    
});
