import React, { Component } from 'react';

class ErrorBoundary extends Component {
	constructor() {
		super();
		this.state = {
			errorFound: false,
			error: '',
		};
	}

	componentDidCatch(err, data) {
		this.setState({
			errorFound: true,
			error: err,
		});
	}

	render = () =>
		this.state.errorFound ? <h1>Conflicts Found</h1> : this.props.children;
}

export default ErrorBoundary;
