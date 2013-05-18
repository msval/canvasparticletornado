// standard shim
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function( callback ) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

// helper functions
function randomMax(max) {
	return Math.floor(Math.random() * max);
}
function getParticleColor() {
	var r = (100 + randomMax(155));
	var g = (100 + randomMax(155));
	var b = (100 + randomMax(155));

	return 'rgb(' + r + ',' + g + ',' + b +  ')';
}
function refreshColor() {
	console.log(defaultColor);
	for (var i = 0; i < particleSystem.particles.length; i++) {
		particleSystem.particles[i].color = singlecolor ? defaultColor : getParticleColor();
	}
}

// dom stuff and fps counter
var canvas = document.getElementById('mainCanvas');
var fpsOut = document.getElementById('fps');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
var fps = 0, now, lastUpdate = (new Date())*1 - 1, fpsFilter = 50;

// globals
var numParticles = 180,
	angleSpeed = 0.1,
	particleSize = 1,
	verticalSpeed = 2,
	widthFactor = 5,
	singlecolor = true,
	defaultColor = '#73F0DF';

var Particle = function () {
	this.h = Math.floor(canvas.height * Math.random());
	this.angle = Math.random() * Math.PI * 2;
	this.color = singlecolor ? defaultColor : getParticleColor();
};

Particle.prototype.draw = function (id) {
	this.angle += angleSpeed;
	this.h -= verticalSpeed;

	if (this.h < 0 || this.h > canvas.height) {
		this.h = Math.floor(canvas.height * Math.random());
	}

	ctx.beginPath();
	ctx.fillStyle = singlecolor ? defaultColor : this.color;
	var sizeFactor = 0.5 + (Math.sin(this.angle) + 1) / 2;
	ctx.arc(canvas.width / 2 + Math.cos(this.angle) * (canvas.height - this.h) / widthFactor, this.h, particleSize * sizeFactor, 0, Math.PI * 2);
	ctx.fill();
};

var ParticleSystem = function () {
	this.particles = [];
	for (var i = 0; i < numParticles; i++) {
		this.particles.push(new Particle(canvas.height * Math.random()));
	}
};
ParticleSystem.prototype.draw = function () {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].draw();
	}
};

var gui = new dat.GUI();
gui.add(window, 'numParticles').min(1).max(1000).step(1).name('Num. Particles').onFinishChange(function() {
	particleSystem = new ParticleSystem();
});
gui.add(window, 'angleSpeed').min(-0.9).max(0.9).step(0.005).name('Angle Speed');
gui.add(window, 'particleSize').min(1).max(10).step(1).name('Particle size');
gui.add(window, 'verticalSpeed').min(-20).max(20).step(0.5).name('VerticalSpeed');
gui.add(window, 'widthFactor').min(2).max(10).step(1).name('Width Factor');
gui.add(window, 'singlecolor').name('Single Color').onFinishChange(refreshColor);
gui.addColor(window, 'defaultColor').name('Default Color').onFinishChange(refreshColor);

var particleSystem = new ParticleSystem();

window.onresize = function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	particleSystem = new ParticleSystem();
};

(function animloop(){
	requestAnimFrame(animloop);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	particleSystem.draw();
	var thisFrameFPS = 1000 / ((now=new Date()) - lastUpdate);
	fps += (thisFrameFPS - fps) / fpsFilter;
	lastUpdate = now;
})();

setInterval(function(){
  fpsOut.innerHTML = fps.toFixed(1) + " fps";
}, 1000);