/* jshint browser: true */
/* jshint esnext: true */

(function() {
    'use strict';

    var url = "../../rest/locations";
    var wrapper = document.querySelector('.accordion');
    var details = document.querySelector('.details');

    ajax.get(url, {format: 'json'}).then(function(response) {
        createMenu(response);
    }, function(error) {
        console.error('Failed!', error);
    });

    function createMenu(response) {
        var ul = document.createElement('ul');
        for (var i = 0; i < response.length; i++) {
            var obj = response[i];
            var li = document.createElement('li');
            var button = document.createElement('button');
            button.innerHTML = obj.name;
            button.addEventListener('click', toggleHandler.bind(button, li, obj));
            li.appendChild(button);
            ul.appendChild(li);
        }
        wrapper.appendChild(ul);
    }

    function toggleHandler(li, obj, event) {
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
    }
})();
