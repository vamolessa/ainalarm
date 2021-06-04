//const ALARM_TIMEOUT = 10 * 1000;
const ALARM_TIMEOUT = 7 * 60 * 1000;
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
	const now = new Date();
	hours_input.value = now.getHours();
	minutes_input.value = now.getMinutes();
}

function on_alarm() {
	clearTimeout(blink_timeout);
	document.title = alert_title;
	blink_timeout = setInterval(function () {
		document.title = blink_on ? alert_title : original_title;
		blink_on = !blink_on;
	}, BLINK_TIMEOUT);

	alarm_audio.play();
}

function start_timer(millis) {
	const delay = millis / 1000;
	timer = delay;
	update_timer_span();
	clearTimeout(timer_timeout);
	timer_timeout = setInterval(function() {
		timer -= 1;
		if (timer <= 0) {
			timer = delay;
		}
		update_timer_span();
	}, 1000);
}

function set_alarm_timer() {
	clearTimeout(alarm_timeout);
	alarm_timeout = setInterval(on_alarm, ALARM_TIMEOUT);
	start_timer(ALARM_TIMEOUT);
}

function on_start_now() {
	update_time_inputs();
	set_alarm_timer();
}

function on_start_from() {
	const timeout_seconds = ALARM_TIMEOUT / 1000;

	const now = new Date();
	const now_seconds = (now.getHours() * 60 + now.getMinutes()) * 60 + now.getSeconds();

	const base_hours = parseInt(hours_input.value);
	if (base_hours == NaN) {
		alert(`${hours_input.value} não é uma hora válida`);
		return;
	}
	const base_minutes = parseInt(minutes_input.value);
	if (base_minutes == NaN) {
		alert(`${minutes_input.value} não é um minuto válido`);
		return;
	}
	const base_seconds = (base_hours * 60 + base_minutes) * 60;

	if (base_seconds < now_seconds) {
		const left_seconds = timeout_seconds - (now_seconds - base_seconds) % timeout_seconds;
		const delay = left_seconds * 1000;
		alarm_timeout = setTimeout(function() {
			on_alarm();
			set_alarm_timer();
		}, delay);
		start_timer(delay);
	} else {
		alert("já passou!");
	}
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
