// window.addEventListener(‘contextmenu’, function (e) {
//     e.preventDefault();
// }, true);

// document.addEventListener('contextmenu', event => event.preventDefault());

let currentPage = 'homecontent';

document.addEventListener("contextmenu", (event) => {
	console.log('contextmenu: ', event);
	event.preventDefault();
});

// test home page google chrome shortcut icon: "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk http://127.0.0.1:1337/touchscreen/index.html

function homeclick(thisPage, nextPage) {
	// alert(nextPage);
	// document.getElementById('homecontent').classList.toggle('animate-fadein');
	// document.getElementById('homecontent').classList.toggle('animate-fadeout');
	console.log('homeclick: thisPage, nextPage', thisPage, nextPage);

	document.getElementById(thisPage).classList.remove('transition-fadein');
	document.getElementById(thisPage).classList.add('transition-fadeout');
	document.getElementById(nextPage).classList.remove('transition-fadeout');
	document.getElementById(nextPage).classList.remove('hide');
	document.getElementById(nextPage).classList.add('transition-fadein');

}

function transitionclick(thisPage, nextPage) {
	// alert(nextPage);
	// document.getElementById('homecontent').classList.toggle('animate-fadein');
	// document.getElementById('homecontent').classList.toggle('animate-fadeout');
	console.log('transitionclick: thisPage, nextPage, currentPage', thisPage, nextPage, currentPage);

	document.getElementById(nextPage).classList.remove('simple-hide');
	console.log('transitionclick: nextPage - remove simple-hide', nextPage);

	document.getElementById(thisPage).classList.add('simple-fadeout');
	console.log('transitionclick: thisPage - add simple-fadeout', thisPage);

	// experimental time here
	document.getElementById(thisPage).classList.add('hide');
	console.log('transitionclick: thisPage - add hide', thisPage);

	document.getElementById(nextPage).classList.remove('simple-fadeout');
	console.log('transitionclick: nextPage - remove simple-fadeout', nextPage);

	if (nextPage === 'screensaver') {
		console.log('transitionclick: nextPage - play video', nextPage);
		console.log('transitionclick: screensavervideo.muted', screensavervideo.muted);
		// screensavervideo.muted = false;
		screensavervideo.play();
	} else {
		console.log('transitionclick: nextPage - pause video', nextPage);
		screensavervideo.pause(); // if (video.paused || video.ended)
		screensavervideo.currentTime = 0;
		screensavervideo.value = 0;
		currentPage = nextPage;
	}
}

// display the screen saver
function screensaver_display() {
	console.log('screensaver_display - start');

	if (screensaver_active) {
		console.log('screensaver_display - screensaver_active', screensaver_active);
		transitionclick(currentPage, 'screensaver');
	}
}

// show the screen saver
function show_screensaver() {
	console.log('show_screensaver');
	screensaver_active = true;
	screensaver_display();
}

// stop the screen saver, transition back to the page it started from
function stop_screensaver() {
	console.log('stop_screensaver');
	screensaver_active = false;
	transitionclick('screensaver', currentPage);

}

// initialize the screen saver, by number of seconds of idle time
function initSetTimeout(idleTime) {
	console.log(`initSetTimeout - Screen Saver idle time reset for ${idleTime} seconds`);

	return setTimeout(function () {
		show_screensaver();
	}, 1000 * idleTime); // wait for idletime secs before displaying the screen saver
}

function initializeTransitioned (element) {
	console.log(`initializeTransitioned: ${element}`);

	const domElement = document.getElementById(element);
	domElement.addEventListener("transitionend", () => {
		console.log(`transitionend: ${element}`, domElement.classList);
		if (domElement.classList.contains('simple-fadeout')) {
			domElement.classList.add('simple-hide');
			console.log(`transitionend: ${element} - add simple-hide`);
			domElement.classList.remove('hide');
			console.log(`transitionend: ${element} - remove hide`);
		}
	});
}