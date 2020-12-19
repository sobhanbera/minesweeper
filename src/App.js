import React, { useState } from 'react';

import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import Minesweeper from './components/Minesweeper';
import Animation from './components/Animation';

function App() {
	const [theme, setTheme] = useState(false);
	const [showAnim, setShowAnim] = useState(false);

	const toggleAnimation = () => {
		const curr = showAnim;
		setShowAnim(!curr);
	};

	return (
		<ErrorBoundary>
			<div className={`main-app ${theme ? 'light' : 'dark'}`}>
				<header>
					<span
						className={`${theme ? 'light' : 'dark'}`}
						onClick={() => {
							const curr = theme;
							setTheme(!curr);
						}}
					>
						Minesweeper
					</span>
				</header>
				<main>
					<Minesweeper
						theme={theme ? 'light' : 'dark'}
						toggleAnimation={toggleAnimation}
					></Minesweeper>
					{showAnim ? (
						<Animation theme={theme ? 'light' : 'dark'} />
					) : null}
				</main>
			</div>
		</ErrorBoundary>
	);
}

export default App;
