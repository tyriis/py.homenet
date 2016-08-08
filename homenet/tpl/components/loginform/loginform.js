/* jshint browser: true */
/* jshint esnext: true */

(function() {
    'use strict';

    // get elements from loginform
    var form = document.querySelector('form');
    var submitButton = form.querySelector('button[type=submit]');
    var usernameInput = form.querySelector('input[type=text]');
    var passwordInput = form.querySelector('input[type=password]');
    var inputTimeout;

    function init() {
        disableSubmit();
        usernameInput.addEventListener('keyup', inputHandler);
        passwordInput.addEventListener('keyup', inputHandler);
        submitButton.addEventListener('click', submitHandler);
    }

    // when login is validated, enable button
    function enableSubmit() {
        submitButton.removeAttribute('disabled');
    }

    // disable button at page load
    function disableSubmit() {
        submitButton.setAttribute('disabled', 'disabled');
    }

    // prevent from triggering events while typing, 0,3 sec
    function inputHandler(event) {
        if (inputTimeout) {
            clearTimeout(inputTimeout);
        }
        inputTimeout = setTimeout(function() {
            validateField(event.target);
            validateForm();
        }, 300);
    }

    // if checks are failed, prevent from submit
    function submitHandler(event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    }

    // if checks of both fields are okay, enable submit button
    function validateForm() {
        if (validateField(usernameInput) && validateField(passwordInput)) {
            enableSubmit();
        }
    }

    // check if username and password input has correct input
    function validateField(inputField) {
        // reset present errors
        removeError(inputField);
        // if event.target is username input
        if (inputField === usernameInput) {
            // check if username input chars are valid, else show error
            if (/^[a-zA-Z0-9_\.\-]+$/.test(usernameInput.value) === false) {
                showError('Der Username darf nur Gross- und Kleinbuchstaben, Zahlen sowie _ - und . beinhalten.', usernameInput);
            return;
            }
            // check if username input has valid length, else show error
            if (usernameInput.value.length < 6 || usernameInput.value.length > 20) {
                showError('Der Username darf nur zwischen 6 und 20 Zeichen lang sein.', usernameInput);
                return;
            }
        // if event.target is password input
        } else {
            // check if password input has valid length, else show error
            if (passwordInput.value.length < 6) {
                showError('Das Passwort muss mindestens 6 Zeichen lang sein.', passwordInput);
                return;
            }
        }
        // if all checks are okay, validate fields
        return true;
    }

    // show an error, if there are invalid inputs in actual field
    function showError(msg, inputField) {
        if (!inputField.value) {
            return;
        }
        var errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.innerHTML = msg;
        inputField.parentNode.insertBefore(errorDiv, inputField.nextElementSibling);
    }

    // if errors are present, reset them all
    function removeError(inputField) {
        while (inputField.nextElementSibling.className === 'error') {
            inputField.parentNode.removeChild(inputField.nextElementSibling);
        }
    }

    init();

})();
