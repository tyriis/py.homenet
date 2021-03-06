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

    /**
     * initialize loginform, all handlers are here
     */
    function init() {
        disableSubmit();
        usernameInput.addEventListener('keyup', inputHandler);
        passwordInput.addEventListener('keyup', inputHandler);
        form.addEventListener('submit', submitHandler);
    }

    /**
     * if login is valide, enable button
     */
    function enableSubmit() {
        submitButton.removeAttribute('disabled');
    }

    /**
     * disable button when page loads
     */
    function disableSubmit() {
        submitButton.setAttribute('disabled', 'disabled');
    }

    /**
     * prevent input from triggering events while typing, 0.3 sec
     * @param {object} event keyup event
     */
    function inputHandler(event) {
 /*       if (inputTimeout) {
            clearTimeout(inputTimeout);
        }
        inputTimeout = setTimeout(function() {*/
            validateField(event.target);
            validateForm();
        //}, 1);
    }

    /**
     * if checks failed, prevent from submit
     * @param {object} event submit event
     */
    function submitHandler(event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    }

    /**
     * if input of both fields are okay, enable submit button
     * @returns {boolean} returns true
     */
    function validateForm() {
        if (validateField(usernameInput) && validateField(passwordInput)) {
            enableSubmit();
            return true;
        }
    }

    /**
     * check if username and password input has correct input
     * @param   {object}  inputField current input element
     * @returns {boolean} returns true
     */
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
            if (usernameInput.value.length < 4 || usernameInput.value.length > 20) {
                showError('Der Username darf nur zwischen 4 und 20 Zeichen lang sein.', usernameInput);
                return;
            }
        // if event.target is password input
        } else {
            // check if password input has valid length, else show error
            if (passwordInput.value.length < 1) {
                showError('Das Passwort muss mindestens 1 Zeichen lang sein.', passwordInput);
                return;
            }
        }
        // if all checks are okay, validate fields
        return true;
    }

    /**
     * show an error, if there are invalid inputs in actual field
     * @param {string} msg        error message
     * @param {object} inputField current input element
     */
    function showError(msg, inputField) {
        if (!inputField.value) {
            return;
        }
        var errorDiv = document.createElement('div');
        errorDiv.classList.add('error');
        errorDiv.innerHTML = msg;
        inputField.classList.add('invalid');
        inputField.parentNode.insertBefore(errorDiv, inputField.nextElementSibling);
    }

    /**
     * if errors are present, reset them all
     * @param {object} inputField current input element
     */
    function removeError(inputField) {
        while (inputField.nextElementSibling.classList.contains('error')) {
            inputField.parentNode.removeChild(inputField.nextElementSibling);
            inputField.classList.remove('invalid');
        }
    }

    init();

})();
