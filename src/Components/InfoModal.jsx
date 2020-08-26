// Libraries
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// InfoModal Component Class
function InfoModal(props) {
	let { show, calcTape, children, handleClose, handleClearTape } = props;

	const modalShowHideClass = show ? 'modal-overlay modal-show' : 'modal-overlay modal-hide';

	const renderCalcTape = () => {
		return calcTape.map((formula) => {
			return <p key={uuidv4()}>{formula}</p>;
		});
	};

	let tapeDisplay = <p>Calculation History Cleared</p>;

	if (calcTape.length > 0) tapeDisplay = renderCalcTape();

	return (
		<div className={modalShowHideClass}>
			<section className="modal-window">
				<div className="modal-header">
					<h1>History</h1>
					<button id="clearTapeBtn" className="modal-button" onClick={handleClearTape}>
						<i className="fas fa-trash" />
					</button>
					<button id="modalCloseBtn" className="modal-button" onClick={handleClose}>
						<i className="fas fa-times" />
					</button>
				</div>
				<div className="tape-display-wrapper">
					{tapeDisplay}
					{/* <h3>
						Created by{' '}
						<a href="https://www.ptrchoi.com" target="_blank">
							Peter Choi
						</a>
					</h3> */}
				</div>
				{children}
			</section>
		</div>
	);
}

export default InfoModal;
