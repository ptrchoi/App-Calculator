import React from "react";

function InfoModal(props) {
  let { show, children, handleClose } = props;

  const modalShowHideClass = show
    ? "modal-overlay modal-show"
    : "modal-overlay modal-hide";
  return (
    <div className={modalShowHideClass}>
      <section className="modal-window">
        <h1>App Info</h1>
        <div>
          <h3>The Minimal Calculator</h3>
          <ul>
            <li>
              A simple REACT web app based on{" "}
              <a href="https://www.freecodecamp.org/ptrchoi" target="_blank">
                FreeCodeCamp.org's
              </a>{" "}
              project curriculum, demonstrating use of front end libraries for a
              calculator app (
              <a
                href="https://learn.freecodecamp.org/front-end-libraries/front-end-libraries-projects/build-a-javascript-calculator"
                target="_blank"
              >
                requirements and user stories here
              </a>
              ). Components have been refactored into single .js and .css files
              for{" "}
              <a
                href="https://codepen.io/ptrchoi/pen/QJRpvQ?editors=0010"
                target="_blank"
              >
                Codepen demonstration
              </a>
              , original source on{" "}
              <a
                href="https://github.com/ptrchoi/FCC-New-Calculator"
                target="_blank"
              >
                github
              </a>
              .
            </li>
            <li>Technologies include but are not limited to:</li>
            <ul>
              <li>Javascript | React | jQuery | SCSS | Node.js | Webpack</li>
            </ul>
            <li>Features and UX:</li>
            <ul>
              <li>Mobile-first, responsive design with font-size scaling.</li>
              <li>Touch as well as mouse and keyboard input.</li>
              <li>
                Code demonstrates functional programming with higher-order
                functions, advanced ES6 features, and modular programming with
                React and SCSS components.
              </li>
            </ul>
            <li>Coming soon...</li>
            <ul>
              <li>Refactor for PWA (Progressive Web App)</li>
            </ul>
          </ul>
        </div>
        {children}
        <button className="modal-close-button" onClick={handleClose}>
          <i className="fas fa-times" />
        </button>
      </section>
    </div>
  );
}

export default InfoModal;
