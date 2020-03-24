import React from 'react';
import ReactDOM from 'react-dom';

//Components
import Calculator from './Components/Calculator';

//Styles
import './styles/app.scss';

class App extends React.Component {
	render() {
		return (
			<div className="app-wrapper">
				<Calculator />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
