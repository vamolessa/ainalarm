onmessage = function(e) {
	const duration = e.data;
	clearTimeout(this.timerTimeout);
	this.timerTimeout = setInterval(function() {
		postMessage(null);
	}, duration);
};
