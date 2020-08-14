import React from 'react';
import Display from './Display';
import InfoModal from './InfoModal';

function convertDigitsToFloat(numArr) {
	let n = numArr.toString();
	n = n.replace(/,/g, '');
	n = parseFloat(n);

	return n;
}

class Inputs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			inputs: {
				prevInputType: null,
				curInputType: null,
				startNewCalc: false
			},
			number: {
				digits: [],
				decimal: false,
				value: null
			},
			operation: {
				opType: null,
				operand: null,
				operator: null
			},
			calculation: {
				replaceQueue: false,
				x: null,
				y: null,
				op: null
			},
			outputs: {
				result: null,
				toDisplay: null
			},
			memory: {
				prevNum: null,
				prevOp: null
			}
		};

		this.animateButton = this.animateButton.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleDigit = this.handleDigit.bind(this);
		this.handleOperation = this.handleOperation.bind(this);
		this.handleEquals = this.handleEquals.bind(this);
		this.handleClear = this.handleClear.bind(this);
		this.showInfo = this.showInfo.bind(this);
		this.hideInfo = this.hideInfo.bind(this);
		this.handleBack = this.handleBack.bind(this);
	}
	componentWillMount() {
		document.addEventListener('keydown', this.handleKeyDown);
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown);
	}
	componentWillReceiveProps(props) {
		if (props.result !== null) {
			this.setState({
				outputs: {
					result: props.result,
					toDisplay: props.result
				}
			});
		}
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

		let { inputs, number } = this.state;
		let { digits, decimal, value } = number;
		let { prevInputType, curInputType, startNewCalc } = inputs;

		let digit = e.target.value;
		let validatedDigit = [];

		this.animateButton(e.target);

		//UPDATE Inputs
		if (curInputType !== 'NUM') {
			//Test for number input immediately following a result. If so, reset number.
			if (curInputType === 'CALC') {
				startNewCalc = true;
				digits = [];
				value = null;
				decimal = false;
			} else {
				startNewCalc = false;
			}
			prevInputType = curInputType;
			curInputType = 'NUM';
		}

		//Format decimal input
		if (digit === '.') {
			//If a leading decimal, add a leading zero
			if (digits.length < 1) {
				validatedDigit = [ 0, '.' ];
				decimal = true;
			} else if (!decimal) {
				validatedDigit = [ '.' ];
				decimal = true;
			} else {
				return;
			}
			//Else add digit
		} else {
			//Check for leading zero (don't allow multiple leading zeros)
			if (digits.length === 0 || Number(digits[0]) !== 0) {
				validatedDigit = [ digit ];
			} else {
				return;
			}
		}

		let updatedDigits = digits.concat(validatedDigit);
		let updatedNum = convertDigitsToFloat(updatedDigits);

		this.setState({
			inputs: {
				prevInputType: prevInputType,
				curInputType: curInputType,
				startNewCalc: startNewCalc
			},
			number: {
				digits: updatedDigits,
				decimal: decimal,
				value: updatedNum
			},
			outputs: {
				toDisplay: updatedDigits
			}
		});
	}
	handleOperation(e) {
		e.preventDefault();

		let { inputs, number, operation, outputs, memory } = this.state;
		let { prevInputType, curInputType, startNewCalc } = inputs;
		let { value } = number;
		let { opType } = operation;
		let { result } = outputs;
		let { prevNum } = memory;

		let newOperator = e.currentTarget.value;
		let newType = opType;
		let newOperand = value;

		this.animateButton(e.currentTarget);

		//Explicitly test for null, since value may equal '0'
		if (value === null) {
			newOperand = prevNum;
		}

		prevInputType = curInputType;
		curInputType = 'OP';

		//OP after NUM
		if (prevInputType === 'NUM') {
			if (startNewCalc) {
				newType = 'NEW';
			} else {
				newType = 'ADD';
			}
		} else if (prevInputType === 'OP') {
			//OP after OP, Consecutive Operators entered
			newType = 'SWAP';
		} else {
			//(prevInputType === "CALC"), OP after CALC
			newType = 'NEW';
			newOperand = result;
		}

		//The data/object to pass to parent/Calculator.jsx
		operation = {
			opType: newType,
			operand: newOperand,
			operator: newOperator
		};

		//Operation started, so set storedResult and reset current digit/number
		this.setState({
			inputs: {
				prevInputType: prevInputType,
				curInputType: curInputType
			},
			number: {
				digits: [],
				decimal: false,
				value: null
			},
			operation: operation,
			outputs: {
				toDisplay: newOperand
			},
			memory: {
				prevNum: newOperand,
				prevOp: newOperator
			}
		});

		this.props.onOperation(operation);
	}
	handleEquals(e) {
		e.preventDefault();

		let { inputs, number, operation, calculation, outputs, memory } = this.state;
		let { value } = number;
		let { prevInputType, curInputType, startNewCalc } = inputs;
		let { operator } = operation;
		let { replaceQueue, x, y, op } = calculation;
		let { result } = outputs;
		let { prevOp } = memory;

		this.animateButton(e.currentTarget);

		prevInputType = curInputType;
		curInputType = 'CALC';

		//CALC after NUM after OP
		if (prevInputType === 'NUM' && !startNewCalc) {
			//NORMAL Calculation [queue + last operation + curNum]
			y = value;
			op = prevOp;
		} else if (prevInputType === 'OP') {
			//CALC immediately after OP [result + operator + result]
			replaceQueue = true;
			x = result;
			y = result;
			op = operator;
		} else {
			//CALC after CALC || startNewCalc, [result + last operation + curNum]
			replaceQueue = true;
			x = result;
			y = value;
			op = prevOp;
		}

		//The data/object to pass to parent/Calculator.jsx
		calculation = {
			replaceQueue: replaceQueue,
			x: x,
			y: y,
			op: op
		};

		this.setState({
			inputs: {
				prevInputType: prevInputType,
				curInputType: curInputType,
				startNewCalc: startNewCalc
			},
			calculation: calculation
		});
		this.props.onEquals(calculation);
	}
	handleBack(e) {
		e.preventDefault();

		let { inputs, number } = this.state;
		let { digits } = number;
		let { curInputType } = inputs;

		this.animateButton(e.currentTarget);

		if (curInputType === 'NUM' && digits.length > 0) {
			digits.pop();
			let updatedNum = convertDigitsToFloat(digits);

			this.setState({
				number: {
					digits: digits,
					value: updatedNum
				},
				outputs: {
					toDisplay: digits
				}
			});
		}
	}
	handleClear(e) {
		e.preventDefault();

		this.animateButton(e.currentTarget);
		this.props.onClear();

		this.setState({
			inputs: {
				prevInputType: null,
				curInputType: null,
				startNewCalc: false
			},
			number: {
				digits: [],
				decimal: false,
				value: null
			},
			operation: {
				opType: null,
				operand: null,
				operator: null
			},
			calculation: {
				replaceQueue: false,
				x: null,
				y: null,
				op: null
			},
			outputs: {
				result: null,
				toDisplay: null
			},
			memory: {
				prevNum: null,
				prevOp: null
			}
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
						<Display toDisplay={this.state.outputs.toDisplay} />
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
					<button id="divide" className="operator-button" value={'/'} onClick={this.handleOperation}>
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
					<button id="multiply" className="operator-button" value={'*'} onClick={this.handleOperation}>
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
					<button id="subtract" className="operator-button" value={'-'} onClick={this.handleOperation}>
						<i className="fas fa-minus" />
					</button>
					<button id="zero" className="button" value={0} onClick={this.handleDigit}>
						0
					</button>
					<button id="decimal" className="button" value={'.'} onClick={this.handleDigit}>
						.
					</button>
					<button id="equals" className="operator-button" value={'='} onClick={this.handleEquals}>
						<i className="fas fa-equals" />
					</button>
					<button id="add" className="operator-button" value={'+'} onClick={this.handleOperation}>
						<i className="fas fa-plus" />
					</button>
				</div>
			</div>
		);
	}
}

export default Inputs;
