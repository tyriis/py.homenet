/* jshint browser: true */
/* jshint esnext: true */

define('components/sidebar/sidebar', [], function() {
    'use strict';

    var menuIcon = document.querySelector('.menu-icon');
    var sidebar = document.querySelector('.sidebar');
    var list = document.querySelector('.list');
    var closeButton = document.querySelector('.closeButton');

    menuIcon.addEventListener('click', openSidebar);

    function openSidebar() {
        if (sidebar.classList.contains('close')) {
            sidebar.classList.remove('close');
        }
        sidebar.classList.add('open');
        closeButton.addEventListener('click', closeSidebar);
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebar.classList.add('close');
        closeButton.removeEventListener('click', closeSidebar);
    }
});
