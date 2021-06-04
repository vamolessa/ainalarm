//const ALERT_TIMEOUT = 10 * 1000;
const ALERT_TIMEOUT = 7 * 60 * 1000;
const TIMER_TIMEOUT = 1000;
const BLINK_TIMEOUT = 500;

const original_title = document.title;
const alert_title = document.title + " (TA NA HORA!)";
const alarm_audio = new Audio("alarm.mp3");

let hours_input = null;
let minutes_input = null;
let timer_span = null;

let alarm_timeout = null;
let timer_timeout = null;
let blink_timeout = null;

let timer = 0;
let blink_on = false;

function update_timer_span() {
	const minutes = Math.floor(timer / 60);
	const seconds = timer % 60;
	const seconds_prefix = seconds < 10 ? "0" : "";
	timer_span.textContent = `${minutes}:${seconds_prefix}${seconds}`;
}

function update_time_inputs() {
	const time = new Date();
	hours_input.value = time.getHours();
	minutes_input.value = time.getMinutes();
}

function on_start_now() {
	update_time_inputs();

	clearTimeout(alarm_timeout);
	alarm_timeout = setInterval(function() {
		clearTimeout(blink_timeout);
		document.title = alert_title;
		blink_timeout = setInterval(function () {
			document.title = blink_on ? alert_title : original_title;
			blink_on = !blink_on;
		}, BLINK_TIMEOUT);

		alarm_audio.play();
	}, ALERT_TIMEOUT);
	
	timer = ALERT_TIMEOUT / TIMER_TIMEOUT;
	update_timer_span();
	clearTimeout(timer_timeout);
	timer_timeout = setInterval(function() {
		timer -= 1;
		if (timer <= 0) {
			timer = ALERT_TIMEOUT / TIMER_TIMEOUT;
		}
		update_timer_span();
	}, TIMER_TIMEOUT);
}

function on_start_from() {
	const delay = 0.0;
	alarm_timeout = setTimeout(on_start_now, delay);
}

window.onfocus = function() {
	clearTimeout(blink_timeout);
	document.title = original_title;

	alarm_audio.pause();
	alarm_audio.fastSeek(0);
};

window.onload = function() {
	hours_input = document.getElementById("hours");
	minutes_input = document.getElementById("minutes");
	timer_span = document.getElementById("timer");

	update_time_inputs();
};
