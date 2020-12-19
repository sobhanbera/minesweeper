import React from 'react';

const Winned = (props) => {
	return (
		<div
			className={`absolute ${props.theme}`}
			onClick={props.setGameToInitial}
		>
			<h2 onClick={props.setGameToInitial}>Winner</h2>
			<span onClick={props.setGameToInitial}>
				TimeTaken: {props.score}
			</span>
			<span onClick={props.setGameToInitial}>Score: {props.score}</span>
		</div>
	);
};

const Gameovered = (props) => {
	return (
		<div
			className={`absolute ${props.theme}`}
			onClick={props.setGameToInitial}
		>
			<h2>Game Over</h2>
			<span>TimeTaken: {props.score}</span>
			<span>Score: {props.score}</span>
		</div>
	);
};

export { Winned, Gameovered };
