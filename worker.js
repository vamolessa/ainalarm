self.onmessage = function(e) {
	console.log("on webworker message");
	
	const timestamp = self.performance.now();
	const duration = e.data.duration - (timestamp - e.data.timestamp);
	clearTimeout(self.timerTimeout);
	self.timerTimeout = setInterval(function() {
		console.log("on webworker timeout");
		self.postMessage(null);
	}, duration);
};
