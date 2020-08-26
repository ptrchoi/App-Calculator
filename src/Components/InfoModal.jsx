import React from 'react';

function InfoModal(props) {
	let { show, calcTape, children, handleClose, handleClearTape } = props;

	const modalShowHideClass = show ? 'modal-overlay modal-show' : 'modal-overlay modal-hide';

	const renderCalcTape = () => {
		return calcTape.map((formula) => {
			return <p>{formula}</p>;
		});
	};

	let tapeDisplay = <p>Calculation History Cleared</p>;

	if (calcTape.length > 0) tapeDisplay = renderCalcTape();

	return (
		<div className={modalShowHideClass}>
			<section className="modal-window">
				<h1>History</h1>
				<button id="clearTape" className="clearTapeButton" onClick={handleClearTape}>
					<i className="fas fa-copyright" />
				</button>
				<div>
					{tapeDisplay}
					{/* <h3>
						Created by{' '}
						<a href="https://www.ptrchoi.com" target="_blank">
							Peter Choi
						</a>
					</h3> */}
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
