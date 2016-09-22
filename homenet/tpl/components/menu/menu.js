/* jshint browser: true */
/* jshint esnext: true */

define('components/menu/menu', ['ajax'], function(ajax) {
    'use strict';

    var menuIcon = document.querySelector('.menu-icon');
    var menu = document.querySelector('.menu');
    var url = '/rest/users/_update_own_password';
    var form = document.querySelector('.passwordForm form' );

    menuIcon.addEventListener('click', toggleMenu);

    form.addEventListener('submit', submitHandler);

    function toggleMenu(event) {
        menu.classList.toggle('openSide');
    }

    function submitHandler(event) {
        event.preventDefault();
        var oldPassword = form.querySelector('input[name="oldPassword"]').value;
        var newPassword = form.querySelector('input[name="newPassword"]').value;
        var newPasswordRepeat = form.querySelector('input[name="newPasswordRepeat"]').value;
        if (newPassword !== newPasswordRepeat) {
            alert('Password missmatch!');
            return;
        }
        // set data for ajax password post
        var data = {
            password: oldPassword,
            new_password: newPassword
        };
        ajax.post(url, {data: data}).then(function(response) {
            console.log('Success!', response);
        }, function(error) {
            console.error('Failed!', error);
        });

    }

});
