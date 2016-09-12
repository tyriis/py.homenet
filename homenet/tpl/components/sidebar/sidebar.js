/* jshint browser: true */
/* jshint esnext: true */

define('components/sidebar/sidebar', [], function() {
    'use strict';

    var menuIcon = document.querySelector('.menu-icon');
    var sidebar = document.querySelector('.sidebar');

    menuIcon.addEventListener('click', toggleSidebar);

    function toggleSidebar(event) {
        sidebar.classList.toggle('openSide');
    }

});
