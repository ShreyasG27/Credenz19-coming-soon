const {
	PI,
	cos,
	sin,
	tan,
	abs,
	sqrt,
	pow,
	min,
	max,
	ceil,
	floor,
	round,
	random,
	atan2
} = Math;
const HALF_PI = 0.5 * PI;
const QUART_PI = 0.25 * PI;
const TAU = 2 * PI;
const TO_RAD = PI / 180;
const G = 6.67 * pow(10, -11);
const EPSILON = 2.220446049250313e-16;
const rand = n => n * random();
const randIn = (_min, _max) => rand(_max - _min) + _min;
const randRange = n => n - rand(2 * n);
const fadeIn = (t, m) => t / m;
const fadeOut = (t, m) => (m - t) / m;
const fadeInOut = (t, m) => {
	let hm = 0.5 * m;
	return abs((t + hm) % m - hm) / hm;
};
const dist = (x1, y1, x2, y2) => sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
const angle = (x1, y1, x2, y2) => atan2(y2 - y1, x2 - x1);
const lerp = (a, b, amt) => (1 - amt) * a + amt * b;
const vh = p => p * window.innerHeight * 0.01;
const vw = p => p * window.innerWidth * 0.01;
const vmin = p => min(vh(p), vw(p));
const vmax = p => max(vh(p), vw(p));
const clamp = (n, _min, _max) => min(max(n, _min), _max);
const norm = (n, _min, _max) => (n - _min) / (_max - _min);

const deflectorCount = 500;
const particleCount = 2000;

let canvas;
let ctx;
let branchNum;
let baseHue;
let deflectors;
let particles;

function setup() {
	var head = document.getElementById("home");
	canvas = {
		a: document.createElement('canvas'),
		b: document.createElement('canvas')
	};
	ctx = {
		a: canvas.a.getContext('2d'),
		b: canvas.b.getContext('2d')
	};
	canvas.b.style = `
		top: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%
	`;
	head.after(canvas.b);
	// document.body.appendChild(canvas.b);
	init();
	draw();
}

function init() {
	resize();
	branchNum = round(rand(5)) + 3;
	baseHue = 224;
	
	deflectors = [];
	for(let i = 0; i < deflectorCount; i++) {
		deflectors.push(getDeflector());
	}
	
	particles = [];
	for(let i = 0; i < particleCount; i++) {
		particles.push(getParticle(i).create());
	}
}

function resize() {
	canvas.a.width = canvas.b.width = window.innerWidth;
	canvas.a.height = canvas.b.height = window.innerHeight;
}

function getDeflector() {
	return {
		position: {
			x: rand(window.innerWidth),
			y: rand(window.innerHeight)
		},
		threshold: rand(100) + 100
	};
}

function getParticle(i) {
	return {
		create() {
			this.position.x = 0.5 * canvas.a.width + randRange(1);
			this.position.y = 0.5 * canvas.a.height + randRange(1);
			this.speed = 5.0;
			this.life = 0;
			this.ttl = 200;
			this.size = rand(2) + 2;
			this.hue = baseHue;
			this.saturation = i / particleCount * 50 + 20;
			this.lightness = i / particleCount * 30 + 20;
			this.direction = round(randRange(branchNum)) * (360 / branchNum) * TO_RAD;
			this.turnRate = round(rand(20)) + 10;
			this.changeDirection = false;
			return this;
		},
		position: {
			x: 0,
			y: 0
		},
		velocity: {
			x: 0,
			y: 0
		},
		update() {
			this.life++;
			if (this.changeDirection && this.life % this.turnRate === 0) {
				this.direction += round(randRange(1)) * (360 / branchNum) * TO_RAD;
				this.changeDirection = false;
			}
			this.position.x += cos(this.direction) * this.speed;
			this.position.y += sin(this.direction) * this.speed;
			this.destroy = this.life > this.ttl;
		},
		draw() {
			this.update();
			ctx.a.beginPath();
			ctx.a.strokeStyle = `hsla(${this.hue},${this.saturation}%,${this.lightness}%,${fadeInOut(this.life, this.ttl) * 0.125})`;
			ctx.a.arc(this.position.x, this.position.y, this.size, 0, TAU);
			ctx.a.stroke()
			ctx.a.closePath();
		}
	}
}

let deflector, particle;

function draw() {
	let i, j;
	for(i = 0; i < particles.length; i++) {
		particle = particles[i];
		for(j = 0; j < deflectors.length; j++) {
			deflector = deflectors[j];
			if (dist(
					particle.position.x, 
					particle.position.y, 
					deflector.position.x, 
					deflector.position.y
				) < deflector.threshold) {
				particle.changeDirection = true;
			}
		}
		particle.draw();
		if (particle.destroy) {
			particles.splice(i, 1);
			continue;
		};
	}
	if (particles.length) {
		ctx.b.save();
		ctx.b.fillStyle = "rgb(0,0,0)";
		ctx.b.fillRect(0,0,canvas.b.width,canvas.b.height);
		ctx.b.restore();

		ctx.b.save();
		ctx.b.filter = "blur(20px)"
		ctx.b.drawImage(canvas.a, 0, 0);
		ctx.b.restore();

		ctx.b.save();
		ctx.b.drawImage(canvas.a, 0, 0);
		ctx.b.restore();
	}
	window.requestAnimationFrame(draw);
}

window.addEventListener("load", setup);
// window.addEventListener("resize", _.debounce(() => {
// 	resize();
// 	init();
// }, 50));
// window.addEventListener("click", init);
