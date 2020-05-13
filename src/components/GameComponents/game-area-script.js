export default function Timer(duration, element) {
	var self = this;
	this.duration = duration;
	this.element = element;
	this.running = false;
	
	this.els = {
		ticker: document.getElementById('ticker'),
		seconds: document.getElementById('seconds'),
	};
}

Timer.prototype.start = function() {
	var self = this;
	var start = null;
	this.running = true;
	var remainingSeconds = this.els.seconds.textContent = this.duration / 1000;
	
	function draw(now) {
		if (!start) start = now;
		var diff = now - start;
		var newSeconds = Math.ceil((self.duration - diff)/1000);

		if (diff <= self.duration) {
			self.els.ticker.style.height = 100 - (diff/self.duration*100) + '%';
			
			if (newSeconds != remainingSeconds) {
				self.els.seconds.textContent = newSeconds;
				remainingSeconds = newSeconds;
			}
			
			self.frameReq = window.requestAnimationFrame(draw);
		} else {
			self.running = false;
			self.els.seconds.textContent = "GO!";
            self.els.ticker.style.height = '0%';
		}
	};
	
	self.frameReq = window.requestAnimationFrame(draw);
}

