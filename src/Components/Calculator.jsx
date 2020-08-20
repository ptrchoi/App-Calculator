import React from 'react';
import Inputs from './Inputs';

function convertArrToString(arr) {
	let str = arr.toString();
	str = str.replace(/,/g, ' ');

	return str;
}

class Calculator extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			calcQueue: {
				operand1: 0,
				operator: '*', // Default to * for # -> = input?
				operand2: 0
			},
			calcMem: {
				result: null, // need to pass this val to Inputs
				prevInput: null
			}
		};

		this.handleDigitInput = this.handleDigitInput.bind(this);
		this.handleOperation = this.handleOperation.bind(this);
		this.handleEquals = this.handleEquals.bind(this);
		this.performCalculation = this.performCalculation.bind(this);
		this.handleClear = this.handleClear.bind(this);
	}
	// For input sequence tracking
	handleDigitInput() {
		this.setState({
			calcMem: {
				prevInput: 'number'
			}
		});
	}
	handleOperation(op, operand) {
		console.log('handleOperation() - op: ', op, ' operand: ', operand);

		let { operand1, operator } = this.state.calcQueue;
		// console.log('handleOperation() - this.state.calcQueue.operator: ', operator);

		let { result, prevInput } = this.state.calcMem;

		// Special case: [op] directly after [=]
		// Behavior: op1 = result, op2 = current operand
		if (prevInput === 'equals') {
			// console.log("prevInput === 'equals'");
			operand1 = result;
			operator = op;
		} else {
			// Else assign operand 1 and op
			operand1 = operand;
			operator = op;
		}
		this.setState({
			calcQueue: {
				operand1: operand1,
				operator: operator
			},
			calcMem: {
				result: result,
				prevInput: 'operator'
			}
		});
	}
	handleEquals(operand) {
		let { operand1, operator, operand2 } = this.state.calcQueue;
		let { result, prevInput } = this.state.calcMem;
		console.log('Calculator: handleEquals() - prevInput: ', prevInput);

		// Special case: [=] directly after [op]
		// Behavior: op1 = result, op2 = result
		if (prevInput === 'operator') {
			operand1 = result;
			operand2 = result;
		} else if (prevInput === 'equals') {
			// Special case: [=] directly after [=]
			// Behavior: op1 = result, op2 = current operand
			operand1 = result;
			operand2 = operand;
		} else {
			operand2 = operand;
		}

		result = this.performCalculation(operand1, operator, operand2);

		this.setState({
			calcQueue: {
				operand1: operand1,
				operator: operator,
				operand2: operand2
			},
			calcMem: {
				result: result,
				prevInput: 'equals'
			}
		});
	}
	performCalculation(x, op, y) {
		let formulaStr = convertArrToString([ x, op, y ]);
		console.log('formulaStr: ', formulaStr);

		return eval(formulaStr);
	}
	handleClear() {
		console.log('Calculator: handleClear');
		this.setState({
			calcQueue: {
				operand1: 0,
				operator: '*',
				operand2: 0
			},
			calcMem: {
				result: null, // need to pass this val to Inputs
				prevInput: null
			}
		});
	}
	render() {
		return (
			<div className="calc-wrapper">
				<Inputs
					onDigit={this.handleDigitInput}
					onOperator={this.handleOperation}
					onEquals={this.handleEquals}
					onClear={this.handleClear}
					calcQueue={this.state.calcQueue}
					calcMem={this.state.calcMem}
				/>
			</div>
		);
	}
}

export default Calculator;

// handleOperation(operation) {
// 	let { calcQueue } = this.state;
// 	let { opType, operand, operator } = operation;

// 	//Update the calcQueue with the operand and operator based on the type of operation (ie: multiple operators input sequentially => SWAP)
// 	if (opType === 'ADD') {
// 		calcQueue = calcQueue.concat([ operand, operator ]);
// 	} else if (opType === 'SWAP') {
// 		calcQueue.pop();
// 		calcQueue = calcQueue.concat(operator);
// 	} else {
// 		//opType === NEW
// 		calcQueue = [ operand, operator ];
// 	}

// 	this.setState({
// 		calcQueue: calcQueue,
// 		result: null
// 	});
// }
// handleEquals(calculation) {
// 	let { result, calcQueue } = this.state;
// 	let { replaceQueue, x, y, op } = calculation;

// 	//Test if new calculation needed (ie. operating on previously calculated result (ie. previous result is an operand))
// 	if (!replaceQueue) {
// 		x = calcQueue;
// 	} else {
// 		x = calcQueue;
// 		// x = [ x, op ];
// 	}
// 	calcQueue = x.concat([ y ]);

// 	let formula = convertArrToString(calcQueue);
// 	result = eval(formula);
// 	this.setState({
// 		calcQueue: calcQueue,
// 		result: result
// 	});
// 	console.log('Calculator>handleEquals - setState for result: ', result);
// }
