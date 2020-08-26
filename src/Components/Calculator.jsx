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

	let answer = eval(formulaStr);
	return {
		formula: formulaStr + ' = ' + answer,
		answer: answer
	};
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
				prevOperand: null,
				calcTape: []
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
		let { calcTape } = this.state.calcMem;
		this.setState({
			calcMem: {
				prevInput: 'number',
				calcTape: calcTape
			}
		});
	}
	handleOperation(op, operand) {
		let { operationQueue, curOperation, calcMem } = this.state;
		let { operand1, operator } = curOperation;
		let { result, prevInput, calcTape } = calcMem;

		// Edge case1: [op] directly after [=]
		if (prevInput === 'equals') {
			operand1 = result;
			operationQueue.push(operand1, op);
		} else {
			if (prevInput === 'operator') {
				// Edge case2: [op] directly after [op]
				// replace end of queue (previous op)
				operationQueue.splice(operationQueue.length - 1, 1, op);
			} else {
				// Else just add new operand and operation as normal
				operationQueue.push(operand, op);

				// Start new calculation
				if (operator === 'none') operand1 = operand;
				else
					// Else Replace operand1 w/ operationQueue
					operand1 = operationQueue;
			}
		}
		this.setState({
			operationQueue: operationQueue,
			curOperation: {
				operand1: operand1,
				operator: op
			},
			calcMem: {
				result: result,
				prevInput: 'operator',
				calcTape: calcTape
			}
		});
	}
	handleEquals(operand) {
		let { curOperation, calcMem } = this.state;
		let { operand1, operator, operand2 } = curOperation;
		let { result, prevInput, prevOperator, prevOperand, calcTape } = calcMem;
		let performCalculation = true;

		// Edge case1: New calculation of [=] directly after [num] with no operator
		if (operator === 'none' && prevOperator === undefined) {
			operator = prevOperator;
			operand2 = prevOperand;
			result = operand;
			performCalculation = false;
		} else if (prevInput === 'operator') {
			// Edge case2: [=] directly after [op]
			if (result) {
				operand1 = result;
				operand2 = result;
			} else {
				operand1 = operand;
				operand2 = operand;
			}
		} else if (prevInput === 'equals') {
			// Edge case3: [=] directly after [=]
			operand1 = result;
			operator = prevOperator;
			operand2 = prevOperand;
		} else {
			// Else normal operation
			operand2 = operand;
		}

		// If operand1 = operationQueue, omit operator since already captured in the queue
		let ignoreOp = Array.isArray(operand1);
		if (performCalculation) {
			let calcObj = calculate(operand1, operator, operand2, ignoreOp);
			result = calcObj.answer;
			console.log(calcObj.formula);
			// Add current calculation to calcTape
			calcTape.push(calcObj.formula);
		}

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
				prevOperand: operand2,
				calcTape: calcTape
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
				prevOperand: null,
				calcTape: []
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
					curOperation={this.state.curOperation}
				/>
			</div>
		);
	}
}

export default Calculator;
