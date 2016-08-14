/* jshint browser: true */
/* jshint esnext: true */

define('components/location/details', ['ajax'], function(ajax) {
    'use strict';

    var baseUrl = "/rest/locations/%id%/sensors";
    var currentId;
    
    /**
     * makes ajax request for sensor data of specific location and builds an access point for menu, to make module loading possible
     * @param   {number} id id of the current clicked location in menu
     * @returns {object} Promise
     */
    function get(id) {
        currentId = id;
        var url = baseUrl.replace('%id%', id);
        return ajax.get(url, {format: 'json'}).then(function(response) {
            return createDetails(response);
        });
    }
    
    function createDetails(response) {
        var div = document.createElement('div');
        for (var i = 0; i < response.length; i++) {
            var obj = response[i];
            var a = document.createElement('a');
            a.href = '#';
            var figure = document.createElement('figure');
            var img = document.createElement('img');
            img.src = '/images/' + obj.key + '.svg';
            var figcaption = document.createElement('figcaption');
            figcaption.innerHTML = obj.last_action.value + '&nbsp;' + obj.unit;
            figure.appendChild(img);
            figure.appendChild(figcaption);
            a.appendChild(figure);
            div.appendChild(a);
        }
        return div;
    }
    
    return {
        get: get
    };
    /*function toggleHandler(li, obj, event) {
        var parent = li.parentNode;
        var activeNodes = parent.querySelectorAll('li.active');
        // if any li has active class and is current li, continue
        for (var i = 0; i < activeNodes.length; i++) {
            if (activeNodes[i] === li) {
                continue;
            }
            // else remove active class
            activeNodes[i].classList.remove('active');
        }
        // and toggle new active class
        li.classList.toggle('active');
        if (li.classList.contains('active')) {
            li.appendChild(details);
        } else {
            li.removeChild(details);
        }
        console.log(obj.nodes);
    }*/
});
