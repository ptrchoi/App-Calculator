import React from "react";
import Inputs from "./Inputs";

function convertArrToString(arr) {
  let str = arr.toString();
  str = str.replace(/,/g, " ");

  return str;
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calcQueue: [],
      result: null
    };

    this.handleOperation = this.handleOperation.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }
  handleOperation(operation) {
    let { result, calcQueue } = this.state;
    let { opType, operand, operator } = operation;

    //Update the calcQueue with the operand and operator based on the type of operation (ie: multiple operators input sequentially => SWAP)
    if (opType === "ADD") {
      calcQueue = calcQueue.concat([operand, operator]);
    } else if (opType === "SWAP") {
      calcQueue.pop();
      calcQueue = calcQueue.concat(operator);
    } else {
      //opType === NEW
      calcQueue = [operand, operator];
    }

    this.setState({
      calcQueue: calcQueue,
      result: null
    });
  }
  handleEquals(calculation) {
    let { result, calcQueue } = this.state;
    let { replaceQueue, x, y, op } = calculation;

    //Test if new calculation needed (ie. operating on previously calculated result (ie. previous result is an operand))
    if (!replaceQueue) {
      x = calcQueue;
    } else {
      x = [x, op];
    }
    calcQueue = x.concat([y]);

    let formula = convertArrToString(calcQueue);
    result = eval(formula);
    this.setState({
      calcQueue: calcQueue,
      result: result
    });
  }
  handleClear() {
    this.setState({
      calcQueue: [],
      result: null
    });
  }
  render() {
    return (
      <div>
        <Inputs
          onOperation={this.handleOperation}
          onEquals={this.handleEquals}
          onClear={this.handleClear}
          result={this.state.result}
        />
      </div>
    );
  }
}

export default Calculator;
