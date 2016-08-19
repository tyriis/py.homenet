/* jshint browser: true */
/* jshint esnext: true */

define('components/location/list', ['ajax', 'components/location/details', 'components/location/charts'], function(ajax, details, charts) {
    'use strict';

    var url = "/rest/locations";
    var listNode = document.querySelector('.list');
/*    var detailsWrapper = document.querySelector('.details');*/
    var interval;

    // get all locations from rest api and render menu
    ajax.get(url, {format: 'json'}).then(function(locations) {
        createMenu(locations);
    });

    /**
     * creates accordion from all locations
     * @param {object} locations json object for all locations from rest
     */
    function createMenu(locations) {
        // creates unordered list for accordion
        var ul = document.createElement('ul');
        for (var i = 0; i < locations.length; i++) {
            var obj = locations[i];
            // creates li element for each location
            var li = document.createElement('li');
            // inside li, create a clickable button
            var button = document.createElement('button');
            button.classList.add('list-button');
            button.innerHTML = obj.name;
            // add eventlistener to button and bind current li and location object to it
            button.addEventListener('click', toggleHandler.bind(button, li, obj));
            // append them all
            li.appendChild(button);
            ul.appendChild(li);
        }
        listNode.appendChild(ul);
    }

    /**
     * toggles accordion
     * @param {object} li    current li element
     * @param {object} obj   current location object
     * @param {object} event current event
     */
    function toggleHandler(li, obj, event) {
        // if interval exists, clear
        if (interval) {
            clearInterval(interval);
        }
        var parent = li.parentNode;
        // find all li elements with class active
        var activeNodes = parent.querySelectorAll('li.active');
        // if founded li is current li, continue
        for (var i = 0; i < activeNodes.length; i++) {
            if (activeNodes[i] === li) {
                continue;
            }
            // else remove active class
            activeNodes[i].classList.remove('active');
        }
        // and toggle active class
        li.classList.toggle('active');

        if (li.classList.contains('active')) {
/*            var li = li;*/
/*            li.appendChild(detailsWrapper);
            // clear wrapper
            detailsWrapper.innerHTML = '';
            // append detail view*/
            showDetails(obj.id, li);
            // setInterval for uptodate sensor data every 10 sec
            interval = setInterval(function() {
                showDetails(obj.id, li);
            }, 10*1000);
        } else {
            for (var j = 0; j < li.childNodes.length; j++) {
                if (li.childNodes[j].classList.contains('details')) {
                    li.removeChild(li.childNodes[j]);
                }
            }
        }
    }

    function showDetails(id, li) {
        details.render(id).then(function(node) {
            for (var i = 0; i < li.childNodes.length; i++) {
                if (li.childNodes[i].classList.contains('details')) {
                    li.removeChild(li.childNodes[i]);
                }
            }
            li.appendChild(node);
        });
    }
});

require(['components/location/list']);
