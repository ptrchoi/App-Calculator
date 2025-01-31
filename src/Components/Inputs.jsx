// LIBRARIES
import React from 'react';
import $ from 'jquery';

// COMPONENTS
import Display from './Display';
import InfoModal from './InfoModal';

// LOCAL FUNCTIONS
function convertDigitsToFloat(numArr) {
	let n = numArr.toString();
	n = n.replace(/,/g, '');
	n = parseFloat(n);
	return n;
}
function popArray(arr) {
	arr.pop();
	if (arr.length < 1) arr = [ 0 ];
	return arr;
}

// INPUTS COMPONENT CLASS
class Inputs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			curDigitArr: [ 0 ],
			curOperand: 0,
			decimal: false,
			displayState: 'input' // input || result
		};

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.animateButton = this.animateButton.bind(this);
		this.showInfo = this.showInfo.bind(this);
		this.hideInfo = this.hideInfo.bind(this);

		this.handleDigit = this.handleDigit.bind(this);
		this.handleDecimal = this.handleDecimal.bind(this);
		this.handleOperator = this.handleOperator.bind(this);
		this.handleEquals = this.handleEquals.bind(this);
		this.handleBackspace = this.handleBackspace.bind(this);
		this.handleClear = this.handleClear.bind(this);
	}
	componentDidMount() {
		let self = this;
		document.addEventListener('keydown', (e) => {
			this.handleKeyDown(e, self);
		});
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown);
	}
	animateButton(button) {
		if (!button.classList.contains('pulse')) {
			button.classList.add('pulse');
			button.addEventListener('transitionend', function removeAnimation() {
				button.classList.remove('pulse');
				button.removeEventListener('transitionend', removeAnimation);
			});
		} else {
			button.classList.remove('pulse');
		}
	}
	handleKeyDown(e, self) {
		e.preventDefault();

		let key = e.key;
		let button = null;

		if (/0|1|2|3|4|5|6|7|8|9/.test(key)) {
			button = $(`button[value=${key}]`);
		} else if (/\+|-|\/|\*|=|\./.test(key)) {
			button = $(`button[value="${key}"]`);
		} else if (key === 'Enter') {
			button = $(`button[value="="]`);
		} else if (key === 'Backspace') {
			button = $(`button[value="Backspace"]`);
		} else if (key === 'Escape' || key === 'c' || key === 'C') {
			button = $(`button[value="c"]`);
		} else if (key === 'I' || key === 'i') {
			button = $(`button[value="i"]`);
		}
		if (button) {
			// Animate button for keyboard input only. Touch already has default selection "animation".
			self.animateButton(document.getElementById(button[0].id));
			button.click();
		}
	}
	handleDigit(e) {
		e.preventDefault();

		let { curDigitArr, decimal } = this.state;
		let { prevInput } = this.props.calcMem;
		let digit = e.target.value;

		// Start a new number (replace digit array)
		if (prevInput === 'equals' || prevInput === 'operator' || (curDigitArr.length === 1 && curDigitArr[0] === 0)) {
			curDigitArr = [ digit ];
			decimal = false; // reset decimal flag on new number
		} else if (digit === '0' && curDigitArr.length === 0)
			// Ignore leading zero
			return;
		else
			// Else concat to existing digit array
			curDigitArr = curDigitArr.concat(digit);

		this.setState({
			curDigitArr: curDigitArr,
			decimal: decimal,
			displayState: 'input'
		});

		// Notify parent of digit input
		this.props.onDigit();
	}
	handleDecimal(e) {
		e.preventDefault();

		let { curDigitArr, decimal } = this.state;
		let decimalVal = '.';

		// Ignore if there's already a decimal in the number
		if (decimal) return;

		// Add leading zero if leading with decimal
		if (curDigitArr.length < 1) decimalVal = [ '0', '.' ];

		this.setState({
			curDigitArr: curDigitArr.concat(decimalVal),
			decimal: true,
			displayState: 'input'
		});

		// Notify parent of digit input
		this.props.onDigit();
	}
	handleOperator(e) {
		e.preventDefault();

		let { curOperand } = this.state;
		let { prevInput } = this.props.calcMem; // null/number/operator/equals
		let op = e.currentTarget.value;
		let display = 'input';

		// Edge case: [op] directly after [=] should continue to display prev result until new number input
		// if (prevInput === 'equals') display = 'result';

		// If ([op] directly after [num]), get new operand and update state.
		if (prevInput === ('number' || null)) {
			// Set new curOperand from digit array
			curOperand = convertDigitsToFloat(this.state.curDigitArr);
			this.setState({
				curOperand: curOperand,
				displayState: display
			});
		}
		// ELSE (prevInput === ('operator' || 'equals')) >> don't update state. Pass the new operator to parent to swap. Pass prev operand for no change (ie. keep displaying prev operand or result).

		// Notify parent of operator input and pass current Operand
		this.props.onOperator(op, curOperand);
	}
	handleEquals(e) {
		e.preventDefault();

		// Upon equals input, set curOperand
		let operand = convertDigitsToFloat(this.state.curDigitArr);
		this.setState({
			curOperand: operand,
			displayState: 'result'
		});

		// Notify parent of equals input and pass current Operand
		this.props.onEquals(operand);

		// this.props.onEquals(convertDigitsToFloat(operand));
	}
	handleBackspace(e) {
		e.preventDefault();

		let { curDigitArr, displayState } = this.state;

		// If current state is result, backspace on result
		if (displayState === 'result') {
			let { result } = this.props.calcMem;

			// Ignore/return if result is invalid number
			if (isNaN(result) || result === null || result.length <= 0 || result === 0) return;

			// Else convert result into an array of digits
			let resultArr = Array.from(String(result), Number);

			// Search/replace any decimal which Array.from method converts to NaN
			resultArr.forEach((item, i) => {
				if (isNaN(item)) resultArr[i] = '.';
			});

			// Remove last digit from array and update curDigitArr with modified result
			curDigitArr = popArray(resultArr);
			displayState = 'input';

			// Pass new result back to parent as float
			this.props.onModifiedResult(convertDigitsToFloat(curDigitArr));
		} else {
			// Else if current state is input, modify current digit array

			// Remove last digit from array if valid #
			if (curDigitArr.length > 0 || convertDigitsToFloat(curDigitArr) !== 0) curDigitArr = popArray(curDigitArr);

			// Notify parent of digit input
			this.props.onDigit();
		}
		this.setState({
			curDigitArr: curDigitArr,
			displayState: displayState
		});
	}
	handleClear(e) {
		e.preventDefault();

		this.props.onClear();

		this.setState({
			curDigitArr: [ 0 ],
			curOperand: 0,
			decimal: false,
			displayState: 'input'
		});
	}
	showInfo() {
		this.setState({
			showInfo: true
		});
	}
	hideInfo() {
		this.setState({
			showInfo: false
		});
	}
	render() {
		let toDisplay = this.state.curDigitArr;
		let { displayState } = this.state;

		if (displayState === 'result') toDisplay = this.props.calcMem.result;

		return (
			<div className="grid">
				<div className="functions-container">
					<button id="clear" className="function-button" value={'c'} onClick={this.handleClear}>
						<i className="fas fa-copyright" />
					</button>
					<button id="info" className="function-button" value={'i'} onClick={this.showInfo}>
						<i className="fas fa-clock" />
					</button>
					<InfoModal
						show={this.state.showInfo}
						calcTape={this.props.calcMem.calcTape}
						handleClose={this.hideInfo}
						handleClearTape={() => this.props.onClearTape()}
					/>
					<button id="back" className="function-button" value={'Backspace'} onClick={this.handleBackspace}>
						<i className="fas fa-backspace" />
					</button>
				</div>
				<div className="display-container">
					<div className="display">
						<Display toDisplay={toDisplay} />
					</div>
				</div>
				<div className="buttons-container">
					<button id="seven" className="button" value={7} onClick={this.handleDigit}>
						7
					</button>
					<button id="eight" className="button" value={8} onClick={this.handleDigit}>
						8
					</button>
					<button id="nine" className="button" value={9} onClick={this.handleDigit}>
						9
					</button>
					<button id="divide" className="operator-button" value={'/'} onClick={this.handleOperator}>
						<i className="fas fa-divide" />
					</button>
					<button id="four" className="button" value={4} onClick={this.handleDigit}>
						4
					</button>
					<button id="five" className="button" value={5} onClick={this.handleDigit}>
						5
					</button>
					<button id="six" className="button" value={6} onClick={this.handleDigit}>
						6
					</button>
					<button id="multiply" className="operator-button" value={'*'} onClick={this.handleOperator}>
						<i className="fas fa-times" />
					</button>
					<button id="one" className="button" value={1} onClick={this.handleDigit}>
						1
					</button>
					<button id="two" className="button" value={2} onClick={this.handleDigit}>
						2
					</button>
					<button id="three" className="button" value={3} onClick={this.handleDigit}>
						3
					</button>
					<button id="subtract" className="operator-button" value={'-'} onClick={this.handleOperator}>
						<i className="fas fa-minus" />
					</button>
					<button id="zero" className="button" value={0} onClick={this.handleDigit}>
						0
					</button>
					<button id="decimal" className="button" value={'.'} onClick={this.handleDecimal}>
						.
					</button>
					<button id="equals" className="operator-button" value={'='} onClick={this.handleEquals}>
						<i className="fas fa-equals" />
					</button>
					<button id="add" className="operator-button" value={'+'} onClick={this.handleOperator}>
						<i className="fas fa-plus" />
					</button>
				</div>
			</div>
		);
	}
}

export default Inputs;
