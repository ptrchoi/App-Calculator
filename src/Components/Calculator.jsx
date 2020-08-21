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
			calcQueue: [],
			calcFormula: {
				operand1: 0,
				operator: 'none', // Default to * for # -> = input?
				operand2: 0
			},
			calcMem: {
				result: null, // need to pass this val to Inputs
				prevInput: null,
				prevOperator: 'none',
				prevOperand: null
			}
		};

		this.handleDigitInput = this.handleDigitInput.bind(this);
		this.handleBackspace = this.handleBackspace.bind(this);
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
	handleBackspace(updatedNum) {
		let { prevInput } = this.state.calcMem;

		// Check for valid #
		if (isNaN(updatedNum)) updatedNum = 0;

		// If [backspace] on a result, update the modified result
		if (prevInput === 'equals') {
			this.setState({
				calcMem: {
					result: updatedNum,
					prevInput: prevInput
				}
			});
		}
	}
	handleOperation(op, operand) {
		let { calcQueue, calcFormula, calcMem } = this.state;
		let { operand1, operator } = calcFormula;
		let { result, prevInput } = calcMem;

		// Edge case: [op] directly after [=]
		if (prevInput === 'equals') {
			operand1 = result;
		} else {
			// Else just add new operand and operation as normal
			calcQueue.push(operand, op);

			// Start new calculation
			if (operator === 'none') operand1 = operand;
			else
				// Else Replace operand1 w/ calcQueue
				operand1 = calcQueue;
		}
		this.setState({
			calcQueue: calcQueue,
			calcFormula: {
				operand1: operand1,
				operator: op
			},
			calcMem: {
				result: result,
				prevInput: 'operator'
			}
		});
	}
	handleEquals(operand) {
		let { calcFormula, calcMem } = this.state;
		let { operand1, operator, operand2 } = calcFormula;
		let { result, prevInput, prevOperator, prevOperand } = calcMem;

		// console.log('Calculator: handleEquals() - prevInput: ', prevInput);

		// Edge case: [=] directly after [op]
		if (prevInput === 'operator') {
			operand1 = result;
			operand2 = result;
		} else if (prevInput === 'equals') {
			// Edge case: [=] directly after [=]
			operand1 = result;
			operator = prevOperator;
			operand2 = prevOperand;
		} else {
			operand2 = operand;
		}

		// If operand1 = calcQueue, omit operator since already captured in the queue
		result = this.performCalculation(operand1, operator, operand2, Array.isArray(operand1));

		this.setState({
			calcQueue: [],
			calcFormula: {
				operand1: operand1,
				operator: 'none', // reset operator
				operand2: operand2
			},
			calcMem: {
				result: result,
				prevInput: 'equals',
				prevOperator: operator,
				prevOperand: operand2
			}
		});
	}
	performCalculation(x, op, y, ignoreOp) {
		let formulaStr = '';
		if (ignoreOp) formulaStr = convertArrToString([ x, y ]);
		else formulaStr = convertArrToString([ x, op, y ]);

		console.log('formulaStr: ', formulaStr);

		return eval(formulaStr);
	}
	handleClear() {
		// console.log('Calculator: handleClear');
		this.setState({
			calcQueue: [],
			calcFormula: {
				operand1: 0,
				operator: 'none',
				operand2: 0
			},
			calcMem: {
				result: null, // need to pass this val to Inputs
				prevInput: null,
				prevOperator: 'none',
				prevOperand: null
			}
		});
	}
	render() {
		return (
			<div className="calc-wrapper">
				<Inputs
					onDigit={this.handleDigitInput}
					onBackspace={this.handleBackspace}
					onOperator={this.handleOperation}
					onEquals={this.handleEquals}
					onClear={this.handleClear}
					calcMem={this.state.calcMem}
				/>
			</div>
		);
	}
}

export default Calculator;

// handleOperation(operation) {
// 	let { calcFormula } = this.state;
// 	let { opType, operand, operator } = operation;

// 	//Update the calcFormula with the operand and operator based on the type of operation (ie: multiple operators input sequentially => SWAP)
// 	if (opType === 'ADD') {
// 		calcFormula = calcFormula.concat([ operand, operator ]);
// 	} else if (opType === 'SWAP') {
// 		calcFormula.pop();
// 		calcFormula = calcFormula.concat(operator);
// 	} else {
// 		//opType === NEW
// 		calcFormula = [ operand, operator ];
// 	}

// 	this.setState({
// 		calcFormula: calcFormula,
// 		result: null
// 	});
// }
// handleEquals(calculation) {
// 	let { result, calcFormula } = this.state;
// 	let { replaceQueue, x, y, op } = calculation;

// 	//Test if new calculation needed (ie. operating on previously calculated result (ie. previous result is an operand))
// 	if (!replaceQueue) {
// 		x = calcFormula;
// 	} else {
// 		x = calcFormula;
// 		// x = [ x, op ];
// 	}
// 	calcFormula = x.concat([ y ]);

// 	let formula = convertArrToString(calcFormula);
// 	result = eval(formula);
// 	this.setState({
// 		calcFormula: calcFormula,
// 		result: result
// 	});
// 	console.log('Calculator>handleEquals - setState for result: ', result);
// }
