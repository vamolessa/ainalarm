//const ALARM_TIMEOUT = 10 * 1000;
const ALARM_TIMEOUT = 7 * 60 * 1000;
const BLINK_TIMEOUT = 500;

const original_title = document.title;
const alert_title = original_title + " (TA NA HORA!)";
const alarm_audio = new Audio("alarm.mp3");

let hours_input = null;
let minutes_input = null;
let seconds_input = null;
let timer_label = null;

let alarm_timeout = null;
let blink_on_alarm_timeout = null;

function on_alarm() {
	clearTimeout(blink_on_alarm_timeout);

	document.title = alert_title;
	let blink_on = false;

	blink_on_alarm_timeout = setInterval(function () {
		document.title = blink_on ? alert_title : original_title;
		blink_on = !blink_on;
	}, BLINK_TIMEOUT);

	alarm_audio.play();
}

function start_timer() {
	clearTimeout(alarm_timeout);

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
	const base_seconds = parseInt(seconds_input.value);
	if (base_seconds == NaN) {
		alert(`${seconds_input.value} não é um minuto válido`);
		return;
	}
	const base_total_seconds = (base_hours * 60 + base_minutes) * 60 + base_seconds;

	if (base_total_seconds > now_seconds) {
		alert("tempo tá no futuro");
		return;
	}

	const seconds_duration = timeout_seconds - (now_seconds - base_total_seconds) % timeout_seconds;
	const timer_end_timestamp = window.performance.now() + seconds_duration * 1000;

	const check_timer = function() {
		let time_left = timer_end_timestamp - window.performance.now();
		if (time_left < 0) {
			time_left = 0;
			on_alarm();
			start_timer();
		}

		time_left = Math.ceil(time_left / 1000);

		const minutes = Math.floor(time_left / 60);
		const seconds = time_left % 60;
		const seconds_prefix = seconds < 10 ? "0" : "";
		timer_label.textContent = `${minutes}:${seconds_prefix}${seconds}`;
	}

	check_timer();
	alarm_timeout = setInterval(check_timer, 1000);
}

window.onfocus = function() {
	clearTimeout(blink_on_alarm_timeout);
	document.title = original_title;

	alarm_audio.pause();
	alarm_audio.fastSeek(0);
};

window.onload = function() {
	hours_input = document.getElementById("hours");
	minutes_input = document.getElementById("minutes");
	seconds_input = document.getElementById("seconds");
	timer_label = document.getElementById("timer");

	const now = new Date();
	hours_input.value = now.getHours();
	minutes_input.value = now.getMinutes();
	seconds_input.value = now.getSeconds();
};
