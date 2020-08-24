import React from 'react';

const MAX_DISPLAY_LENGTH = 18;
const DECIMAL_PLACES = 4;

function convertDigitsToFloat(numArr) {
	let n = numArr.toString();
	n = n.replace(/,/g, '');
	n = parseFloat(n);

	return n;
}
function handleExpNotation(n) {
	n = convertDigitsToFloat(n);
	return n.toExponential(DECIMAL_PLACES);
}

function Display(props) {
	let n = props.toDisplay;

	// Error handle number value
	if (n === undefined || n === NaN || n === Infinity) {
		return (
			<div>
				<p id="display">ERR</p>
			</div>
		);
	}

	//Input can be a number or an array, this allows display handling for decimal and zero
	if (n) {
		if (typeof n === 'number') {
			let str = n.toString();

			// Handle number exceeding max length w/ exp notation
			if (str.length > MAX_DISPLAY_LENGTH) n = handleExpNotation(n);
		} else {
			// Error handle array values
			for (let i = 0; i < n.length; i++) {
				if ((n[i] === undefined || isNaN(n[i])) && n[i] !== '.') {
					return (
						<div>
							<p id="display">ERR</p>
						</div>
					);
				}
			}
			// Handle array values exceeding max length w/ exp notation
			if (n.length > MAX_DISPLAY_LENGTH) n = handleExpNotation(n);
		}

		return (
			<div>
				<p id="display">{n}</p>
			</div>
		);
	} else {
		return (
			<div>
				<p id="display">0</p>
			</div>
		);
	}
}

export default Display;
