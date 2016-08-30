/* jshint browser: true */
/* jshint esnext: true */

define('components/location/list', ['ajax', 'components/location/details', 'components/location/charts'], function(ajax, details, charts) {
    'use strict';

    var url = "/rest/locations";
    var listNode = document.querySelector('.list');
    // current active location
    var location;
    // check for touch support
    var hasTouch = 'ontouchstart' in window;
    var touchstartX;
    var touchstartY;

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
            // creates li element for each location
            var li = document.createElement('li');
            if (hasTouch) {
                li.addEventListener('touchstart', touchstartHandler);
            }
            // inside li, create a clickable button
            var button = document.createElement('button');
            button.classList.add('list-button');
            button.innerHTML = locations[i].name;
            // add eventlistener to button and bind current li object to it
            button.addEventListener('click', toggleHandler.bind(button, locations[i], li));
            // append them all
            li.appendChild(button);
            ul.appendChild(li);
        }
        listNode.appendChild(ul);
    }

    /**
     * toggles accordion
     * @param {object} currentLocation
     * @param {object} li              current li
     * @param {object} event           event
     */
    function toggleHandler(currentLocation, li, event) {
        location = currentLocation;
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
            removeTabs();
            details.remove();
            charts.remove();
        }
        // toggle active class
        li.classList.toggle('active');
        if (li.classList.contains('active')) {
            createTabs(li, location);
            details.create(location);
            li.appendChild(details.node);
        } else {
            // remove all elements from dom
            removeTabs();
            details.remove();
            charts.remove();
        }
    }

    /**
     * show detail view
     */
    function showDetails() {
        var li = getActiveLi();
        // if no active li, nothing to do
        if (!li) {
            return;
        }
        var detailsNode = li.querySelector('.details');
        // if details are already open, nothing to do
        if (detailsNode) {
            return;
        }
        details.create(location);
        charts.remove();
        li.appendChild(details.node);
    }

    /**
     * show charts view
     */
    function showCharts() {
        var li = getActiveLi();
        // if no active li, nothing to do
        if (!li) {
            return;
        }
        var chartsNode = li.querySelector('.charts');
        // if charts are already open, nothing to do
        if (chartsNode) {
            return;
        }
        charts.create(location);
        details.remove();
        li.appendChild(charts.node);
    }

    /**
     * creates toggle button for details and charts
     * @param   {object} li current active li
     * @returns {object} returns rendered button element
     */
    function createTabs(li) {
        var tabs = document.createElement('div');
        tabs.classList.add('tabs');
        li.appendChild(tabs);

        var detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.classList.add('detailsButton');
        detailsButton.addEventListener('click', showDetails);
        tabs.appendChild(detailsButton);


        var chartsButton = document.createElement('button');
        chartsButton.textContent = 'Charts';
        chartsButton.classList.add('chartsButton');
        chartsButton.addEventListener('click', showCharts);
        tabs.appendChild(chartsButton);
    }

    /**
     * removes button element from dom
     */
    function removeTabs() {
        var tabs = document.querySelector('.tabs');
        tabs.parentNode.removeChild(tabs);
    }

    /**
     * get active li
     * @returns {object} returns active li element
     */
    function getActiveLi() {
        return document.querySelector('li.active');
    }

    /**
     * set touchendHandler and save pageX, pageY to vars
     * @param {object} event
     */
    function touchstartHandler(event) {
        // if li is undefined or li doesn't contain event.target, do nothing
        var li = getActiveLi();
        if (!li || !li.contains(event.target)) {
            return;
        }
        // add eventlistener touchend to event target
        event.target.addEventListener('touchend', touchendHandler);
        // set vars of touchstart coords
        touchstartX = event.changedTouches[0].pageX;
        touchstartY = event.changedTouches[0].pageY;
    }

    /**
     * set touchend pageX, pageY to vars and get diffs
     * check if touchevent is slide left or slide right and render details/charts
     * @param {object} event [[Description]]
     */
    function touchendHandler(event) {
        // remove eventlistener touchend
        event.target.removeEventListener('touchend', touchendHandler);
        // set vars of touchend coords
        var touchendX = event.changedTouches[0].pageX;
        var touchendY = event.changedTouches[0].pageY;
        // get diff of touchend and touchstart coords
        var diffX = touchendX - touchstartX;
        var diffY = touchendY - touchstartY;
        // check if diffX is greater than 0
        if (diffX > 0) {
            // and if diffY is less than 0
            if (diffY < 0) {
                // change +/- sign
                diffY = diffY * -1;
            }
            // check if it is slide left or right, and add tolerance of 10 for tapping
            if (diffY < diffX && diffX > 150) {
                var li = getActiveLi();
                var charts = li.querySelector('.charts');
                // if charts view is present, change to details
                if (charts) {
                    showDetails();
                }
            }
        // check if diffX is less than 0
        } else if (diffX < 0) {
            // and if diffY is greater than 0
            if (diffY > 0) {
                // change +/- sign
                diffY = diffY * -1;
            }
            // check if it is slide left or right, and add tolerance of 10 for tapping
            if (diffY > diffX && diffX < -150) {
                var li = getActiveLi();
                var details = li.querySelector('.details');
                // if details view is present, change to charts
                if (details) {
                    showCharts();
                }
            }
        }
    }

});

