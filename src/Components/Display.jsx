import React from "react";

const MAX_DISPLAY_LENGTH = 18;
const DECIMAL_PLACES = 4;

function convertDigitsToFloat(numArr) {
  let n = numArr.toString();
  n = n.replace(/,/g, "");
  n = parseFloat(n);

  return n;
}

function Display(props) {
  let n = props.toDisplay;

  if (n === undefined || n === NaN || n === Infinity) {
    return (
      <div>
        <p id="display">ERR</p>
      </div>
    );
  }

  //Input can be a number or an array, this allows display handling for decimal and zero
  if (n) {
    //if typeof n === "number", check length
    if (typeof n === "number") {
      let str = n.toString();
      if (str.length > MAX_DISPLAY_LENGTH) {
        n = convertDigitsToFloat(n);
        n = n.toExponential(DECIMAL_PLACES);
      }
    } else {
      for (let i = 0; i < n.length; i++) {
        if ((n[i] === undefined || n[i] === NaN) && n[i] !== ".") {
          return (
            <div>
              <p id="display">ERR</p>
            </div>
          );
        }
      }

      if (n.length > MAX_DISPLAY_LENGTH) {
        n = convertDigitsToFloat(n);
        n = n.toExponential(DECIMAL_PLACES);
      }
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
