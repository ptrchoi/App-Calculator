import React from 'react';

function InfoModal(props) {
	let { show, children, handleClose } = props;

	const modalShowHideClass = show ? 'modal-overlay modal-show' : 'modal-overlay modal-hide';
	return (
		<div className={modalShowHideClass}>
			<section className="modal-window">
				<h1>App Info</h1>
				<div>
					<h3>
						Created by{' '}
						<a href="https://www.ptrchoi.com" target="_blank">
							Peter Choi
						</a>
					</h3>
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
