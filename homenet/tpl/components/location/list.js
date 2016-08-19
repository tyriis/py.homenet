/* jshint browser: true */
/* jshint esnext: true */

define('components/location/list', ['ajax', 'components/location/details'], function(ajax, details) {
    'use strict';

    var url = "/rest/locations";
    var wrapper = document.querySelector('.list');
    var detailsWrapper = document.querySelector('.details');
    var interval;

    ajax.get(url, {format: 'json'}).then(function(response) {
        createMenu(response);
    });

    function createMenu(response) {
        var ul = document.createElement('ul');
        for (var i = 0; i < response.length; i++) {
            var obj = response[i];
            var li = document.createElement('li');
            var button = document.createElement('button');
            button.classList.add('list-button');
            button.innerHTML = obj.name;
            /* bind li element and current object to toggle function */
            button.addEventListener('click', toggleHandler.bind(button, li, obj));
            li.appendChild(button);
            ul.appendChild(li);
        }
        wrapper.appendChild(ul);
    }

    function toggleHandler(li, obj, event) {
        // if interval exists, clear
        if (interval) {
            clearInterval(interval);
        }
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
            li.appendChild(detailsWrapper);
            // clear wrapper
            detailsWrapper.innerHTML = '';
            // append detail view
            showDetails(obj.id);
            // setInterval for uptodate sensor data every 10 sec
            interval = setInterval(function() {
                showDetails(obj.id);
            }, 10*1000);
        } else {
            li.removeChild(detailsWrapper);
        }
    }

    function showDetails(id) {
        details.get(id).then(function(node) {
            detailsWrapper.innerHTML = '';
            detailsWrapper.appendChild(node);
        });
    }
});

require(['components/location/list']);
