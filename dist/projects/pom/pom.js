'use strict';

document.addEventListener("DOMContentLoaded", function (event) {

    var settings = {
        'counting': false
    };
    var intervalID = 0;

    var prompt = document.getElementById('prompt');
    var start = document.getElementById('tomatoPic');
    var workTime = document.getElementById('workTime');
    var restTime = document.getElementById('restTime');
    var timerDisplay = document.getElementById('timer');
    var status = document.getElementById('status');
    var display = document.getElementById('display');

    start.addEventListener("click", function () {
        if (!settings.counting) {
            settings.counting = true;
            settings.work = workTime.value;
            settings.rest = restTime.value;
            if (checkInput()) {
                timerDisplay.innerHTML = settings.work;
                prompt.style.display = 'none';
                display.style.display = 'block';
                countdown('work');
            }
        } else {
            resetter();
        }
    });

    timerDisplay.addEventListener("click", function () {
        var event = new Event('click');
        start.dispatchEvent(event);
    });

    function checkInput() {
        var neg = settings.work < 0 || settings.rest < 1;
        var notNum = isNaN(settings.work) || isNaN(settings.rest);
        if (neg || notNum) {
            resetter();
            return false;
        }
        return true;
    }

    function resetter() {
        workTime.value = settings.work;
        restTime.value = settings.rest;
        prompt.style.display = "block";
        display.style.display = "none";
        clearInterval(intervalID);
        settings.counting = false;
    }

    function timeLeft(date) {
        return date - Date.now();
    }

    function formatTime(time) {
        var mins = Math.floor(time / (60 * 1000)).toString();
        var secs = (Math.floor(time / 1000) % 60).toString();
        return ('0' + mins).slice(-2) + ':' + ('0' + secs).slice(-2);
    }

    function countdown(phase) {
        var end = Date.now() + settings[phase] * 60 * 1000;
        timerDisplay.innerHTML = formatTime(timeLeft(end));
        intervalID = setInterval(function () {
            if (phase === 'work' && timeLeft(end) < 1000) {
                alert('Work period finished. Take a break!');
                clearInterval(intervalID);
                countdown('rest');
                status.innerHTML = 'TAKE A BREAK!';
            } else if (phase === 'rest' && timeLeft(end) < 1000) {
                alert('Back to work!');
                clearInterval(intervalID);
                resetter();
            } else {
                timerDisplay.innerHTML = formatTime(timeLeft(end));
            }
        }, 1000);
    }
});