// LIBRARIES
import React from 'react';

// COMPONENTS
import Inputs from './Inputs';

// LOCAL FUNCTIONS
function convertArrToString(arr) {
	let str = arr.toString();
	str = str.replace(/,/g, ' ');

	return str;
}
function calculate(x, op, y, ignoreOp) {
	let formulaStr = '';
	if (ignoreOp) formulaStr = convertArrToString([ x, y ]);
	else formulaStr = convertArrToString([ x, op, y ]);

	console.log('formulaStr: ', formulaStr);

	return eval(formulaStr);
}

// CALCULATOR COMPONENT CLASS
class Calculator extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			operationQueue: [],
			curOperation: {
				operand1: 0,
				operator: 'none',
				operand2: 0
			},
			calcMem: {
				result: null,
				prevInput: null,
				prevOperator: 'none',
				prevOperand: null
			}
		};

		this.handleDigitInput = this.handleDigitInput.bind(this);
		this.handleOperation = this.handleOperation.bind(this);
		this.handleEquals = this.handleEquals.bind(this);
		this.handleModifiedResult = this.handleModifiedResult.bind(this);
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
		let { operationQueue, curOperation, calcMem } = this.state;
		let { operand1, operator } = curOperation;
		let { result, prevInput } = calcMem;

		// Edge case: [op] directly after [=]
		if (prevInput === 'equals') {
			operand1 = result;
		} else {
			// Else just add new operand and operation as normal
			operationQueue.push(operand, op);

			// Start new calculation
			if (operator === 'none') operand1 = operand;
			else
				// Else Replace operand1 w/ operationQueue
				operand1 = operationQueue;
		}
		this.setState({
			operationQueue: operationQueue,
			curOperation: {
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
		let { curOperation, calcMem } = this.state;
		let { operand1, operator, operand2 } = curOperation;
		let { result, prevInput, prevOperator, prevOperand } = calcMem;

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

		// If operand1 = operationQueue, omit operator since already captured in the queue
		result = calculate(operand1, operator, operand2, Array.isArray(operand1));

		this.setState({
			operationQueue: [],
			curOperation: {
				operand1: operand1,
				operator: 'none', // reset operator after operation
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
	handleModifiedResult(updatedNum) {
		// Check for valid #
		if (isNaN(updatedNum)) updatedNum = 0;

		// If [backspace] on a result, update the modified result
		this.setState({
			calcMem: {
				result: updatedNum,
				prevInput: 'number'
			}
		});
	}
	handleClear() {
		this.setState({
			operationQueue: [],
			curOperation: {
				operand1: 0,
				operator: 'none',
				operand2: 0
			},
			calcMem: {
				result: null,
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
					onOperator={this.handleOperation}
					onEquals={this.handleEquals}
					onModifiedResult={this.handleModifiedResult}
					onClear={this.handleClear}
					calcMem={this.state.calcMem}
				/>
			</div>
		);
	}
}

export default Calculator;
