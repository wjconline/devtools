
let bgColor = '';
let fgColor = '';
let fgOpacity = 1;
let fontColor = '';
let fontOpacity = 1;

/*
To calculate the equivalent opaque RGB color for a given partially transparent RGB color against a white background, you can use the following formula:

	Y = 255 - P * (255 - X)

where X is the RGB number of the partially transparent color, P is the opacity (0…1), and Y is the new RGB number which should give the same appearance with 100% opacity as X gives with P opacity against a white background 1.

If you are using Illustrator and want to copy the color with the color picker, make a copy of the partially transparent object and rasterize it. Select white background in the rasterizing dialog. Now the color picker gives the color, no calculations are needed
*/

function returnHex(intValue) {
	const hexValue = intValue > 0 ? intValue.toString(16) : '00';
	console.log('returnHex: intValue, hexValue', intValue, hexValue);
	return hexValue;
}

function calculateColor(backgroundHex, colorHex, opacity = 1) {
	console.log(backgroundHex, colorHex, opacity);
	const bg = parseColor(backgroundHex);
	const color = parseColor(colorHex);
	const resultColor = getColor(bg, color, opacity);

	let hexRed = returnHex(resultColor.r);
	let hexGreen = returnHex(resultColor.g);
	let hexBlue = returnHex(resultColor.b);
	let hexColor = hexRed
		+ hexGreen
		+ hexBlue;
	const computedColor = hexColor;

	console.log('calculateColor: background', backgroundHex, 'color', colorHex, 'opacity', opacity, 'bg', bg, 'color', color);
	console.log('calculateColor: resultColor, hexRed, hexGreen, hexBlue, hexColor', resultColor, hexRed, hexGreen, hexBlue, hexColor);
	console.log('calculateColor: resultColor', resultColor, 'computed color', computedColor);
	return computedColor;
}

// function calculate() {
//   const bg = parseColor(background.value);
//   const color = parseColor(document.getElementById('color').value);
//   const resultColor = getColor(bg, color, opacity.value);
//
//   return resultColor.r.toString(16)
//           + resultColor.g.toString(16)
//           + resultColor.b.toString(16);
// }

function parseColor(clr) {
	if (!clr) throw new Error('Color must not be empty!')
	if (clr[0]=='#') clr = clr.slice(1);
	if (clr.length != 3 && clr.length != 6) throw new Error('Incorrect color value!');
	return clr.length == 3
		? {
			r: parseInt(clr[0]+clr[0], 16),
			g: parseInt(clr[1]+clr[1], 16),
			b: parseInt(clr[2]+clr[2], 16)
		}
		: {
			r: parseInt(clr.slice(0,2), 16),
			g: parseInt(clr.slice(2,4), 16),
			b: parseInt(clr.slice(4,6), 16)
		};
}

function getColor(bg, clr, op) {
	// check if <== 1
	console.log('getColor: bg, clr, op', bg, clr, op);
	const opacity = parseFloat(op);
	console.log('getColor: opacity', opacity);
	// const afterOpacity = (clr,op,bg=[255,255,255]) => clr.map((colFg,idx)=>op*colFg+(1-op)*bg[idx]);
	const afterOpacity = (clr,op,bg=[255,255,255]) => clr.map((colFg,idx)=>op*colFg+(1-op)*bg[idx]);
	console.log('getClr: afterOpacity', afterOpacity([clr.r,clr.g,clr.b],opacity,[bg.r,bg.g,bg.b]));

	return {
		r: getClr(bg.r, clr.r, opacity),
		g: getClr(bg.g, clr.g, opacity),
		b: getClr(bg.b, clr.b, opacity)
	}
}

function getClr(bg, clr, op) {
	// op = op / 100;
	// 255 - P* (255-X)
	// const afterOpacity = (fg,o,bg=[255,255,255]) => fg.map((colFg,idx)=>o*colFg+(1-o)*bg[idx]) where fg is the foreground colour as [r,g,b], o is the opacity (0...1) and bg is the background colour (defaults to white if omitted) E.g. afterOpacity([255,0,0],0.5) gives [255,127.5,127.5]

	// where fg is the foreground colour as [r,g,b],
	// o is the opacity (0...1) and bg is the background colour (defaults to white if omitted) E.g. afterOpacity([255,0,0],0.5) gives [255,127.5,127.5]

	const G = 2.2;
	const Y = (bg^G * (1 - op) + clr^G * op) ^ (1 / G);
	// where Y — resulting RGB component value, X — overlay RGB component value, P — its opacity, G — a value of a gamma. Most common value of a gamma is 2.2
	console.log('getClr: Y', Y);

	// const calculatedRaw = bg + op * (clr - bg);
	const calculatedRaw = bg + op * (clr - bg);
	let calculatedColor = Math.round(calculatedRaw);
	console.log('getClr: bg, clr, op, calculatedRaw, calculatedColor', bg, clr, op, calculatedRaw, calculatedColor);
	console.log('getClr: ', bg, ' + (', op,  ' * (', clr - bg, '))');
	return calculatedColor;
}

function checkContrast(bgColor, fgColor) {
	console.log('checkContrast: bgColor, fgColor', bgColor, fgColor);
	bgColor = bgColor.replaceAll('#', '');
	fgColor = fgColor.replaceAll('#', '');
	const checkURL = `https://webaim.org/resources/contrastchecker/?fcolor=${fgColor}&bcolor=${bgColor}&api`;

	return fetch(checkURL)
		.then(response => {
			const contentType = response.headers.get('content-type');
			if (!contentType || !contentType.includes('application/json')) {
				throw new TypeError("Oops, we haven't got JSON!");
			}
			return response.json();
		})
		.then(data => {
			/* process your data further */
			console.log(data);
			return data;
		})
		.catch(error => {
			console.error(error)
			return error;
		});

	//   fetch(checkURL)
	//       .then(response => response.json())
	//       .then(data => console.log(data));
}

function checkColors(bgColor, fgColor, fontColor) {
	console.log('checkColors: bgColor, fgColor, fontColor', bgColor, fgColor, fontColor);

	backgroundColorTested.innerText = bgColor;
	foregroundColorTested.innerText = fgColor;

	checkContrast(bgColor, fgColor).then (data => {
		/* process your data further */
		console.log('checkColors: bgColor, fgColor, data', bgColor, fgColor, data);
		contrastRatioBgFg.innerText = data.ratio;
		fgNormalAA.innerText = data.AA;
		fgNormalAAA.innerText = data.AAA;
		fgNormalAA.style.backgroundColor = (data.AA === 'fail') ? '#FF0000' : '#00FF00';
		fgNormalAAA.style.backgroundColor = (data.AAA === 'fail') ? '#FF0000' : '#00FF00';

		fgNormalExample.style.backgroundColor = bgColor;
		fgNormalExample.style.color = '#' + fgColor;
		//      fgNormalExample.innerText = bgFgResponse;
		fgLargeAA.innerText = data.AALarge;
		fgLargeAAA.innerText = data.AAALarge;
		//      fgLargeExample.innerText = bgFgResponse;
		fgLargeAA.style.backgroundColor = (data.AALarge === 'fail') ? '#FF0000' : '#00FF00';
		fgLargeAAA.style.backgroundColor = (data.AAALarge === 'fail') ? '#FF0000' : '#00FF00';

		fgLargeExamples.style.backgroundColor = bgColor;
		fgLargeExamples.style.color = '#' + fgColor;
		return data;
	})

	/*
{
"ratio": "2.84",
"AA": "fail",
"AALarge": "fail",
"AAA": "fail",
"AAALarge": "fail"
}

	const contrastRatioBgFg = document.getElementById('contrastRatioBgFg');
	const fgNormalAA = document.getElementById('fgNormalAA');
	const fgNormalAAA = document.getElementById('fgNormalAAA');
	const fgNormalExample = document.getElementById('fgNormalExample');
	const fgLargeAA = document.getElementById('fgLargeAA');
	const fgLargeAAA = document.getElementById('fgLargeAAA');
	const fgLargeExample = document.getElementById('fgLargeExample');
*/

	if (fontColor) {
		foregroundAsBgTested.innerText = fgColor;
		fontColorTested.innerText = fontColor;
		checkContrast(fgColor, fontColor).then (data => {
			/* process your data further */
			console.log('checkColors: bgColor, fgColor, data', fgColor, fontColor, data);

			// WoDo: updateForegroundResults display error messages and update / clear as needed
			contrastRatioFgFont.innerText = data.ratio;
			fontNormalAA.innerText = data.AA;
			fontNormalAAA.innerText = data.AAA;
			fontNormalAA.style.backgroundColor = (data.AA === 'fail') ? '#FF0000' : '#00FF00';
			fontNormalAAA.style.backgroundColor = (data.AAA === 'fail') ? '#FF0000' : '#00FF00';
			fontNormalExample.style.backgroundColor = '#' + fgColor;
			fontNormalExample.style.color = fontColor;          //      fontLargeExample.innerText = data;
			//      fontNormalExample.innerText = data;
			fontLargeAA.innerText = data.AALarge;
			fontLargeAAA.innerText = data.AAALarge;
			fontLargeAA.style.backgroundColor = (data.AALarge === 'fail') ? '#FF0000' : '#00FF00';
			fontLargeAAA.style.backgroundColor = (data.AAALarge === 'fail') ? '#FF0000' : '#00FF00';

			fontLargeExamples.style.backgroundColor = '#' + fgColor;
			fontLargeExamples.style.color = fontColor;          //      fontLargeExample.innerText = data;
			return data;
		});
		/*
						const contrastRatioFgFont = document.getElementById('contrastRatioFgFont');
						const fontNormalAA = document.getElementById('fontNormalAA');
						const fontNormalAAA = document.getElementById('fontNormalAAA');
						const fontNormalExample = document.getElementById('fontNormalExample');
						const fontLargeAA = document.getElementById('fontLargeAA');
						const fontLargeAAA = document.getElementById('fontLargeAAA');
						const fontLargeExample = document.getElementById('fontLargeExample');
		*/

	}
}

function updateColors() {
	console.log('colorContrast, colorInputs', colorContrast, colorInputs);

	colorInputs.forEach(function(colorInput) {
		// console.log(colorInput);
		switch (colorInput.id) {
			case 'backgroundColor':
				console.log('backgroundColor', colorInput.value, backgroundColorDisplay);
				// if (colorInput.value) {
				backgroundColorDisplay.style.backgroundColor = colorInput.value;
				bgColor = colorInput.value;
				// }
				break;
			case 'foregroundColor':
				console.log('foregroundColor', colorInput.value);
				foregroundColorDisplay.style.backgroundColor = colorInput.value;
				fgColor = colorInput.value;
				break;
			case 'foregroundOpacity':
				console.log('foregroundOpacity', colorInput.value);
				foregroundColorDisplay.style.opacity = colorInput.value;
				fgOpacity = colorInput.value;
				break;
			case 'fontColor':
				console.log('fontColor', colorInput.value);
				fontTextDisplay.style.color = colorInput.value;
				fontColorDisplay.style.backgroundColor = colorInput.value;
				fontColor = colorInput.value;
				break;
			case 'fontOpacity':
				console.log('fontOpacity', colorInput.value);
				fontTextDisplay.style.opacity = colorInput.value;
				fontColorDisplay.style.opacity = colorInput.value;
				fontOpacity = colorInput.value;
				break;
			default:
				console.log(`error in switch.`);
		}
	});

	// let foregroundStyles = window.getComputedStyle(foregroundColorDisplay);
	// console.log('foregroundStyles computed color is ', foregroundStyles.getPropertyValue('color'));
	// console.log('foregroundStyles computed background color is', foregroundStyles.getPropertyValue('background-color'));
	// let fontTextStyles = window.getComputedStyle(fontTextDisplay);
	// console.log('Font Text computed color is ', foregroundStyles.getPropertyValue('color'));
	// console.log('computed line-height is', foregroundStyles.getPropertyValue('line-height'));
	// let fontColorStyles = window.getComputedStyle(fontColorDisplay);
	// console.log('computed background color is ', fontColorStyles.getPropertyValue('background-color'));
	// console.log('computed line-height is', foregroundStyles.getPropertyValue('line-height'));


	let fgComputed = calculateColor(bgColor, fgColor, fgOpacity || 1).toUpperCase();
	console.log('fgOpacity', fgOpacity);

	let fontComputed = fontColor;

	let haveFgOpacity = (fgOpacity !== '' && fgOpacity < 1);
	let haveFontOpacity = (fontOpacity !== '' && fontOpacity < 1);

	let calcBg = bgColor;
	let calcFg = fontColor;
	let calcOp = fgOpacity;

	if (haveFgOpacity && haveFontOpacity) {
		calcFg = calculateColor(fgColor, fontColor, fontOpacity);
		console.log('We have both:', calcFg);
		fontComputed = '#' + calculateColor(calcBg, calcFg, calcOp).toUpperCase();
	} else if (haveFontOpacity) {
		console.log('bg, f, fontOpacity:', calculateColor(fgComputed, fontColor, fontOpacity));
		calcBg = fgComputed;
		calcOp = fontOpacity;
		fontComputed = '#' + calculateColor(calcBg, calcFg, calcOp).toUpperCase();
	} else if (haveFgOpacity) {
		fontComputed = '#' + calculateColor(calcBg, calcFg, calcOp).toUpperCase();
	}
	//         fontComputed = '#' + calculateColor(calcBg, calcFg, calcOp).toUpperCase();

	/*
	Background Color	#FFFFFF	N/A	N/A
	Foreground Color	#000000	0.4	#999999
	Font Color	#AAAAAA		#DDDDDD
	background 000 color #AAAAAA opacity 0.7 computed color 777777
	#000000	0.4	#999999 | #AAAAAA 0.7 #C9C9C9

	 */

	console.log('fgOpacity', fgOpacity);

	backgroundColorEntered.innerText = bgColor.toUpperCase();
	foregroundColorEntered.innerText = fgColor.toUpperCase();
	foregroundColorEnteredSwatch.style.backgroundColor = fgColor;
	foregroundColorOpacity.innerText = fgOpacity;
	foregroundColorComputed.innerText = '#' + fgComputed.toUpperCase();
	foregroundColorComputedSwatch.style.backgroundColor = '#' + fgComputed;

	fontColorEntered.innerText = fontColor.toUpperCase();
	fontColorEnteredSwatch.style.backgroundColor = fontColor;
	fontColorOpacity.innerText = fontOpacity;
	fontColorComputed.innerText = fontComputed;
	fontColorComputedSwatch.style.backgroundColor = fontComputed;
	// backgroundColorComputed  fontTextComputed

	checkColors(bgColor , fgComputed, fontComputed);

}

function handleChange(e) {
	console.log(e.currentTarget.value, e);
	// log.textContent = `The field's value is
	//   ${e.target.value.length} character(s) long.`;
	updateColors();
}

function initLoader() {
	console.log('initLoader');
}
function initApp() {
	console.log('initApp');

	const colorContrast = document.getElementById('colorContrast');
	const colorInputs = colorContrast.querySelectorAll('input[type="text"]');
	// console.log('colorContrast, colorInputs', colorContrast, colorInputs);

	const backgroundColorEntered = document.getElementById('backgroundColorEntered');
	const foregroundColorEntered = document.getElementById('foregroundColorEntered');
	const foregroundColorEnteredSwatch = document.getElementById('foregroundColorEnteredSwatch');
	const foregroundColorOpacity = document.getElementById('foregroundColorOpacity');
	const foregroundColorComputed = document.getElementById('foregroundColorComputed');
	const foregroundColorComputedSwatch = document.getElementById('foregroundColorComputedSwatch');
	const fontColorEntered = document.getElementById('fontColorEntered');
	const fontColorEnteredSwatch = document.getElementById('fontColorEnteredSwatch');
	const fontColorOpacity = document.getElementById('fontColorOpacity');
	const fontColorComputed = document.getElementById('fontColorComputed');
	const fontColorComputedSwatch = document.getElementById('fontColorComputedSwatch');

	const backgroundColorDisplay = document.getElementById('backgroundColorDisplay');
	const foregroundColorDisplay = document.getElementById('foregroundColorDisplay');
	const fontTextDisplay = document.getElementById('fontTextDisplay');
	const fontColorDisplay = document.getElementById('fontColorDisplay');

	const backgroundColorTested = document.getElementById('backgroundColorTested');
	const foregroundColorTested = document.getElementById('foregroundColorTested');
	const foregroundAsBgTested = document.getElementById('foregroundAsBgTested');
	const fontColorTested = document.getElementById('fontColorTested');

	const contrastRatioBgFg = document.getElementById('contrastRatioBgFg');
	const fgNormalAA = document.getElementById('fgNormalAA');
	const fgNormalAAA = document.getElementById('fgNormalAAA');
	const fgNormalExample = document.getElementById('fgNormalExample');
	const fgLargeAA = document.getElementById('fgLargeAA');
	const fgLargeAAA = document.getElementById('fgLargeAAA');
	const fgLargeExamples = document.getElementById('fgLargeExamples');
	const fgLargeExampleBold = document.getElementById('fgLargeExampleBold');
	const fgLargeExample = document.getElementById('fgLargeExample');

	const contrastRatioFgFont = document.getElementById('contrastRatioFgFont');
	const fontNormalAA = document.getElementById('fontNormalAA');
	const fontNormalAAA = document.getElementById('fontNormalAAA');
	const fontNormalExample = document.getElementById('fontNormalExample');
	const fontLargeAA = document.getElementById('fontLargeAA');
	const fontLargeAAA = document.getElementById('fontLargeAAA');
	const fontLargeExamples = document.getElementById('fontLargeExamples');
	const fontLargeExampleBold = document.getElementById('fontLargeExampleBold');
	const fontLargeExample = document.getElementById('fontLargeExample');

	const recalculate = document.getElementById('recalculate');
	const relog = document.getElementById('relog');

	// console.log(colorContrast);
	// console.log(colorInputs);

	colorInputs.forEach(function(colorInput) {
		// console.log(colorInput);
		colorInput.onchange = handleChange;
	});

	recalculate.onclick = function(event) {
		// console.log('recalculate: event, relog, relog.checked', event, relog, relog.checked)
		if (relog.checked) {
			console.clear();
		}
		console.log('recalculate: event, relog, relog.checked', event, relog, relog.checked)

		// updateColors();
	}

	// updateColors();
}

document.addEventListener("readystatechange", (event) => {
	if (event.target.readyState === "interactive") {
		initLoader();
	} else if (event.target.readyState === "complete") {
		initApp();
	}
});


/*
<style>
h3::after {
content: ' rocks!';
}
</style>

<h3>Generated content</h3>

<script4>
var h3 = document.querySelector('h3');
var result = getComputedStyle(h3, ':after').content;

console.log('the generated content is: ', result); // returns ' rocks!'
</script4>
*/
