/* jshint browser: true */
/* jshint esnext: true */

define('components/location/list', ['ajax', 'components/location/details', 'components/location/charts'], function(ajax, details, charts) {
    'use strict';

    var url = "/rest/locations";
    var listNode = document.querySelector('.list');

    // get all locations from rest api and render menu
    ajax.get(url).then(function(locations) {
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
            var location = locations[i];
            // creates li element for each location
            var li = document.createElement('li');
            // inside li, create a clickable button
            var button = document.createElement('button');
            button.classList.add('list-button');
            button.innerHTML = location.name;
            // add eventlistener to button and bind current li and location object to it
            button.addEventListener('click', toggleHandler.bind(button, li, location));
            // append them all
            li.appendChild(button);
            ul.appendChild(li);
        }
        listNode.appendChild(ul);
    }

    /**
     * toggles accordion
     * @param {object} li       current li element
     * @param {object} location current location
     * @param {object} event    current event
     */
    function toggleHandler(li, location, event) {
        var parent = li.parentNode;
        // find all li elements with class active
        var activeNodes = parent.querySelectorAll('li.active');
        // if founded li is current li, continue
        for (var i = 0; i < activeNodes.length; i++) {
            if (activeNodes[i] === li) {
                continue;
            }
            // else remove all elements from dom
            activeNodes[i].classList.remove('active');
            removeButton();
            details.remove();
            charts.remove();
        }
        // toggle active class
        li.classList.toggle('active');
        if (li.classList.contains('active')) {
            details.create(location).then(function() {
                createButton(li).addEventListener('click', toggleDetails.bind(null, location, li));
            });
            li.appendChild(details.node);
        } else {
            // remove all elements from dom
            removeButton();
            details.remove();
            charts.remove();
        }
    }

    /**
     * toggles details and charts view
     * @param {object} location current location
     * @param {object} li       current clicked li
     */
    function toggleDetails(location, li) {
        if (li.querySelector('.details')) {
            charts.create(location).then(function() {
                details.remove();
            });
            li.appendChild(charts.node);
        } else {
            details.create(location).then(function() {
                charts.remove();
            });
            li.appendChild(details.node);
        }
    }

    /**
     * creates toggle button for details and charts
     * @param   {object} li current clicked li
     * @returns {object} returns rendered button element
     */
    function createButton(li) {
        var button = document.createElement('button');
        button.textContent = 'more…';
        button.classList.add('more-button');
        li.appendChild(button);
        return button;
    }

    /**
     * removes button element from dom
     */
    function removeButton() {
        var button = document.querySelector('.more-button');
        button.parentNode.removeChild(button);
    }

});

require(['components/location/list']);
