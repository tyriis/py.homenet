/* jshint browser: true */
/* jshint esnext: true */

define('components/sidebar/sidebar', [], function() {
    'use strict';

    var menuIcon = document.querySelector('.menu-icon');
    var sidebar = document.querySelector('.sidebar');
    var list = document.querySelector('.list');

    menuIcon.addEventListener('click', toggleSidebar);

    function toggleSidebar() {
        sidebar.classList.toggle('openSide');
        list.classList.toggle('openMenu');
    }

});
