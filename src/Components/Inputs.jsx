import React from 'react';
import $ from 'jquery';
import Display from './Display';
import InfoModal from './InfoModal';

function convertDigitsToFloat(numArr) {
	let n = numArr.toString();
	n = n.replace(/,/g, '');
	n = parseFloat(n);

	return n;
}
function validDecimal() {
	//
}
class Inputs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			curDigitArr: [],
			curOperand: 0,
			decimal: false,
			displayState: 'input' // input OR result
		};

		document.addEventListener('keydown', this.handleKeyDown);

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.animateButton = this.animateButton.bind(this);

		this.handleDigit = this.handleDigit.bind(this);
		this.handleDecimal = this.handleDecimal.bind(this);
		this.handleOperator = this.handleOperator.bind(this);
		this.handleEquals = this.handleEquals.bind(this);

		this.handleBack = this.handleBack.bind(this);
		this.handleClear = this.handleClear.bind(this);
		this.showInfo = this.showInfo.bind(this);
		this.hideInfo = this.hideInfo.bind(this);
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
	handleKeyDown(e) {
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
			button.click();
		}
	}
	handleDigit(e) {
		e.preventDefault();
		this.animateButton(e.target);

		let { curDigitArr } = this.state;

		let digit = e.target.value;
		console.log('handleDigit() - digit: ', digit);

		let { prevInput } = this.props.calcMem;
		console.log('before switch statement - prevInput: ', prevInput);

		// Start a new number (replace digit array)
		if (prevInput === 'equals' || prevInput === 'operator') curDigitArr = digit;
		else if (digit === '0' && curDigitArr.length === 0)
			// Ignore if a leading zero
			return;
		else
			// Else concat to existing digit array
			curDigitArr = curDigitArr.concat(digit);

		this.setState({
			curDigitArr: curDigitArr,
			displayState: 'input'
		});

		// Notify parent of digit input
		this.props.onDigit();
	}
	handleDecimal(e) {
		e.preventDefault();
		this.animateButton(e.target);

		// console.log('handleDecimal()');

		let { curDigitArr, decimal } = this.state;
		if (decimal) return;

		let decimalVal = '.';

		// Add leading zero if leading with decimal
		if (curDigitArr.length < 1) decimalVal = [ '0', '.' ];

		this.setState({
			curDigitArr: curDigitArr.concat(decimalVal),
			decimal: true,
			displayState: 'input'
		});

		// Notify parent of digit input (including '.' as a number type of input)
		this.props.onDigit();
	}
	handleOperator(e) {
		e.preventDefault();
		this.animateButton(e.currentTarget);
		let op = e.currentTarget.value;

		let { prevInput } = this.props.calcMem;

		// console.log('handleOperator() - op: ', op);

		// Special case: [op] directly after [=], should continue display prev result until new number input
		let display = 'input';
		if (prevInput === 'equals') display = 'result';

		// Upon operator input, set curOperand
		let operand = convertDigitsToFloat(this.state.curDigitArr);
		this.setState({
			curOperand: operand,
			displayState: display
		});
		// Notify parent of operator input and pass current Operand
		this.props.onOperator(op, operand);
	}
	handleEquals(e) {
		e.preventDefault();
		this.animateButton(e.currentTarget);

		// console.log('handleEquals()');

		// Upon equals input, set curOperand
		let operand = convertDigitsToFloat(this.state.curDigitArr);
		this.setState({
			curOperand: operand,
			displayState: 'result'
		});

		// Notify parent of equals input and pass current Operand
		this.props.onEquals(convertDigitsToFloat(operand));
	}
	handleBack(e) {
		e.preventDefault();
		this.animateButton(e.currentTarget);

		console.log('handleBack()');

		// let { inputs, number } = this.state;
		// let { digits } = number;
		// let { curInputType } = inputs;

		// this.animateButton(e.currentTarget);

		// if (curInputType === 'NUM' && digits.length > 0) {
		// 	digits.pop();
		// 	let updatedNum = convertDigitsToFloat(digits);

		// 	this.setState({
		// 		number: {
		// 			digits: digits,
		// 			value: updatedNum
		// 		},
		// 		outputs: {
		// 			toDisplay: digits
		// 		}
		// 	});
		// }
	}
	handleClear(e) {
		e.preventDefault();
		this.animateButton(e.currentTarget);

		this.props.onClear();

		this.setState({
			curDigitArr: [],
			decimal: false,
			displayState: 'input'
		});
	}
	showInfo() {
		// console.log('showInfo()');
		// this.setState({
		// 	showInfo: true
		// });
	}
	hideInfo() {
		// console.log('hideInfo()');
		// this.setState({
		// 	showInfo: false
		// });
	}
	render() {
		let toDisplay = this.state.curDigitArr;
		let { displayState } = this.state;

		// let { result } = this.props.calcMem;

		// console.log('displayState: ', displayState, ' result: ', result);

		if (displayState === 'result') toDisplay = this.props.calcMem.result;

		return (
			<div className="grid">
				<div className="functions-container">
					<button id="clear" className="function-button" value={'c'} onClick={this.handleClear}>
						<i className="fas fa-copyright" />
					</button>
					<button id="info" className="function-button" value={'i'} onClick={this.showInfo}>
						<i className="fas fa-info-circle" />
					</button>
					<InfoModal show={this.state.showInfo} handleClose={this.hideInfo} />
					<button id="back" className="function-button" value={'Backspace'} onClick={this.handleBack}>
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

// constructor(props) {
// 	super(props);

// 	this.state = {
// 		inputs: {
// 			prevInputType: null,
// 			curInputType: null,
// 			startNewCalc: false
// 		},
// 		number: {
// 			digits: [],
// 			decimal: false,
// 			value: null
// 		},
// 		operation: {
// 			opType: null,
// 			operand: null,
// 			operator: null
// 		},
// 		calculation: {
// 			replaceQueue: false,
// 			x: null,
// 			y: null,
// 			op: null
// 		},
// 		outputs: {
// 			// result: null,
// 			toDisplay: null
// 		},
// 		memory: {
// 			prevNum: null,
// 			prevOp: null
// 		}
// 	};
// componentWillReceiveProps(props) {
// 	console.log('componentWillReceiveProps - props: ', props);
// 	if (props.result !== null) {
// 		this.setState({
// 			outputs: {
// 				result: props.result,
// 				toDisplay: props.result
// 			}
// 		});
// 	}
// }
// handleDigit(e) {
// 	e.preventDefault();

// 	let { inputs, number } = this.state;
// 	let { digits, decimal, value } = number;
// 	let { prevInputType, curInputType, startNewCalc } = inputs;

// 	let digit = e.target.value;
// 	let validatedDigit = [];

// 	this.animateButton(e.target);

// 	//Test for number input immediately following a result. If so, reset number.
// 	if (curInputType !== 'NUM') {
// 		//Test for number input immediately following a result. If so, reset number.
// 		if (curInputType === 'CALC') {
// 			startNewCalc = true;
// 			digits = [];
// 			value = null;
// 			decimal = false;
// 		} else {
// 			startNewCalc = false;
// 		}
// 		prevInputType = curInputType;
// 		curInputType = 'NUM';
// 	}

// 	//Test Digit input for number or decimal
// 	//If decimal, format decimal input
// 	if (digit === '.') {
// 		//If a leading decimal, add a leading zero
// 		if (digits.length < 1) {
// 			validatedDigit = [ 0, '.' ];
// 			decimal = true;
// 		} else if (!decimal) {
// 			//If the number doesn't already have a decimal, add it
// 			validatedDigit = [ '.' ];
// 			decimal = true;
// 		} else {
// 			//Else ignore decimal input as there is already a decimal in the number
// 			return;
// 		}
// 		//Else input is a digit, add digit
// 	} else {
// 		//Check for non-leading zero (don't allow multiple leading zeros)
// 		if (digits.length === 0 || Number(digits[0]) !== 0 || decimal === true) {
// 			validatedDigit = [ digit ];
// 		} else {
// 			//Else ignore zero input
// 			return;
// 		}
// 	}

// 	let updatedDigits = digits.concat(validatedDigit);
// 	let updatedNum = convertDigitsToFloat(updatedDigits);

// 	this.setState({
// 		inputs: {
// 			prevInputType: prevInputType,
// 			curInputType: curInputType,
// 			startNewCalc: startNewCalc
// 		},
// 		number: {
// 			digits: updatedDigits,
// 			decimal: decimal,
// 			value: updatedNum
// 		},
// 		outputs: {
// 			toDisplay: updatedDigits
// 		}
// 	});
// }
// handleOperator(e) {
// 	e.preventDefault();

// 	let { inputs, number, operation, outputs, memory } = this.state;
// 	// let { inputs, number, operation, memory } = this.state;
// 	let { prevInputType, curInputType, startNewCalc } = inputs;
// 	let { value } = number;
// 	let { opType } = operation;
// 	let { toDisplay } = outputs;
// 	let { prevNum } = memory;

// 	// let result = this.props.result;

// 	// console.log('handleOperator() - outputs.result: ', result);

// 	let result = this.props.result;

// 	let newOperator = e.currentTarget.value;
// 	let newType = opType;
// 	let newOperand = value;

// 	this.animateButton(e.currentTarget);

// 	//Explicitly test for null, since value may equal '0'
// 	if (value === null) {
// 		newOperand = prevNum;
// 	}

// 	prevInputType = curInputType;
// 	curInputType = 'OP';

// 	//OP after NUM
// 	if (prevInputType === 'NUM') {
// 		if (startNewCalc) {
// 			newType = 'NEW';
// 		} else {
// 			newType = 'ADD';
// 		}
// 	} else if (prevInputType === 'OP') {
// 		//OP after OP, Consecutive Operators entered
// 		newType = 'SWAP';
// 	} else {
// 		//(prevInputType === "CALC"), OP after CALC
// 		newType = 'ADD';
// 		// newOperand = result;

// 		/*-----------
// 		Here's the problem - <toDisplay> is not getting updated from prev Calculator result
// 		-------------------*/
// 		newOperand = result; // newOperand gets prev result (ie: toDisplay)
// 	}

// 	//The data/object to pass to parent/Calculator.jsx
// 	operation = {
// 		opType: newType,
// 		operand: newOperand,
// 		operator: newOperator
// 	};

// 	//Operation started, so set storedResult and reset current digit/number
// 	this.setState({
// 		inputs: {
// 			prevInputType: prevInputType,
// 			curInputType: curInputType
// 		},
// 		number: {
// 			digits: [],
// 			decimal: false,
// 			value: null
// 		},
// 		operation: operation,
// 		outputs: {
// 			toDisplay: newOperand
// 		},
// 		memory: {
// 			prevNum: newOperand,
// 			prevOp: newOperator
// 		}
// 	});

// 	this.props.onOperation(operation);
// }
// handleEquals(e) {
// 	e.preventDefault();

// 	// let { inputs, number, operation, calculation, outputs, memory } = this.state;
// 	let { inputs, number, operation, calculation, memory } = this.state;
// 	let { value } = number;
// 	let { prevInputType, curInputType, startNewCalc } = inputs;
// 	let { operator } = operation;
// 	let { replaceQueue, x, y, op } = calculation;
// 	// let { result } = outputs;
// 	let { prevOp } = memory;

// 	let result = this.props.result;

// 	// console.log('handleEquals() - outputs.result: ', result);

// 	this.animateButton(e.currentTarget);

// 	prevInputType = curInputType;
// 	curInputType = 'CALC';

// 	//CALC after NUM after OP
// 	if (prevInputType === 'NUM' && !startNewCalc) {
// 		//NORMAL Calculation [queue + last operation + curNum]
// 		y = value;
// 		op = prevOp;
// 	} else if (prevInputType === 'OP') {
// 		//CALC immediately after OP [result + operator + result]
// 		replaceQueue = true;
// 		x = result;
// 		y = result;
// 		op = operator;
// 	} else {
// 		//CALC after CALC || startNewCalc, [result + last operation + curNum]
// 		replaceQueue = true;
// 		x = result;
// 		y = value;
// 		op = prevOp;
// 	}

// 	//The data/object to pass to parent/Calculator.jsx
// 	calculation = {
// 		replaceQueue: replaceQueue,
// 		x: x,
// 		y: y,
// 		op: op
// 	};

// 	this.setState({
// 		inputs: {
// 			prevInputType: prevInputType,
// 			curInputType: curInputType,
// 			startNewCalc: startNewCalc
// 		},
// 		calculation: calculation
// 	});
// 	this.props.onEquals(calculation);
// }
