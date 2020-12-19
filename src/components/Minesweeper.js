import React, { useEffect, useState } from 'react';
import { Pause, Retry, Flag, Pickaxe } from './Icons';
import { Winned, Gameovered } from './Actions.js';

function idGenerator() {
	var S4 = function () {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return (
		S4() +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		'-' +
		S4() +
		S4() +
		S4()
	);
}

function Minesweeper(props) {
	const [color, setColor] = useState('#0f60b6');
	const [array, setArray] = useState([]);
	const [numOfBomb, setNumberOfBomb] = useState(15);
	const [gameover, setGameOver] = useState(false);
	const [playerWon, setPlayerWon] = useState(false);
	const [openFlag, setOpenFlag] = useState(true); //true for open
	const [temp, setTempValue] = useState(false);
	// const [timeTaken, setTimeTaken] = useState('00:00:00');
	// const [firstTime, setFirstTime] = useState(false);

	useEffect(() => {
		suffleGrid(0);
		// runTimer();
	}, []);

	// let update,
	// 	time = 0,
	// 	tempp = 0,
	// 	sec = 0,
	// 	min = 0,
	// 	hour = 0;
	// const runTimer = () => {
	// 	update = setInterval(() => {
	// 		time++;
	// 		tempp = time;
	// 		hour = Math.floor(tempp / 3600);
	// 		tempp -= hour * 3600;
	// 		min = Math.floor(tempp / 60);
	// 		tempp -= min * 60;
	// 		sec = tempp;
	// 		tempp = 0;
	// 		setTimeTaken(
	// 			`${('0' + hour).slice(-2)}:${('0' + min).slice(-2)}:${(
	// 				'0' + sec
	// 			).slice(-2)}`
	// 		);
	// 	}, 1 * 1000);
	// 	// setTimeTaken('00:00:00');
	// 	// clearInterval(update);
	// 	// setTimeout(() => setTimeTaken(timeRemain - 1), 1000);
	// };

	const changeValueBasedOnNeighbour = (arr, i, j, n) => {
		let cnt = 0;
		if (i > 0 && i < n - 1 && j > 0 && j < n - 1) {
			if (arr[i - 1][j - 1].val <= -1) cnt++; //top-left
			if (arr[i - 1][j].val <= -1) cnt++; //top
			if (arr[i - 1][j + 1].val <= -1) cnt++; //top-right
			//
			if (arr[i][j - 1].val <= -1) cnt++; //left
			//
			if (arr[i][j + 1].val <= -1) cnt++; //right
			//
			if (arr[i + 1][j - 1].val <= -1) cnt++; //bottom-left
			if (arr[i + 1][j].val <= -1) cnt++; //bottom
			if (arr[i + 1][j + 1].val <= -1) cnt++; //bottom-right
		} else if (i === 0 && j === 0) {
			if (arr[i][j + 1].val <= -1) cnt++;
			if (arr[i + 1][j].val <= -1) cnt++;
			if (arr[i + 1][j + 1].val <= -1) cnt++;
		} else if (i === 0 && j === n - 1) {
			if (arr[i][j - 1].val <= -1) cnt++;
			if (arr[i + 1][j - 1].val <= -1) cnt++;
			if (arr[i + 1][j].val <= -1) cnt++;
		} else if (i === n - 1 && j === 0) {
			if (arr[i - 1][j].val <= -1) cnt++;
			if (arr[i - 1][j + 1].val <= -1) cnt++;
			if (arr[i][j + 1].val <= -1) cnt++;
		} else if (i === n - 1 && j === n - 1) {
			if (arr[i - 1][j - 1].val <= -1) cnt++;
			if (arr[i - 1][j].val <= -1) cnt++;
			if (arr[i][j - 1].val <= -1) cnt++;
		} else if (i === 0 && j > 0 && j < n - 1) {
			if (arr[i][j - 1].val <= -1) cnt++; //left
			if (arr[i][j + 1].val <= -1) cnt++; //right
			if (arr[i + 1][j - 1].val <= -1) cnt++; //bottom-left
			if (arr[i + 1][j].val <= -1) cnt++; //bottom
			if (arr[i + 1][j + 1].val <= -1) cnt++; //bottom-right
		} else if (i > 0 && i < n - 1 && j === 0) {
			if (arr[i - 1][j].val <= -1) cnt++; //top
			if (arr[i - 1][j + 1].val <= -1) cnt++; //top-right
			if (arr[i][j + 1].val <= -1) cnt++; //right
			if (arr[i + 1][j + 1].val <= -1) cnt++; //bottom-right
			if (arr[i + 1][j].val <= -1) cnt++; //bottom
		} else if (i > 0 && i < n - 1 && j === n - 1) {
			if (arr[i - 1][j].val <= -1) cnt++; //top
			if (arr[i - 1][j - 1].val <= -1) cnt++; //top-left
			if (arr[i][j - 1].val <= -1) cnt++; //left
			if (arr[i + 1][j - 1].val <= -1) cnt++; //bottom-left
			if (arr[i + 1][j].val <= -1) cnt++; //bottom
		} else if (i === n - 1 && j > 0 && j < n - 1) {
			if (arr[i - 1][j - 1].val <= -1) cnt++; //top-left
			if (arr[i - 1][j].val <= -1) cnt++; //top
			if (arr[i - 1][j + 1].val <= -1) cnt++; //top-right
			if (arr[i][j - 1].val <= -1) cnt++; //left
			if (arr[i][j + 1].val <= -1) cnt++; //right
		}
		return cnt;
	};

	const colorIsLight = (color) => {
		let r, g, b, hsp;
		if (color.match(/^rgb/)) {
			color = color.match(
				/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
			);
			r = color[1];
			g = color[2];
			b = color[3];
		} else {
			color = +(
				'0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&')
			);
			r = color >> 16;
			g = (color >> 8) & 255;
			b = color & 255;
		}

		hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
		//return true if the givne colro in the argument is light...
		// console.log(hsp, hsp > 127.5);
		return hsp > 127.5;
	};

	const suffleGrid = (level) => {
		// time = 0;
		let numOfBomb = 15 + 8 * level,
			ran1,
			ran2,
			gridSize = 12;
		if (level > 3) {
			gridSize = 18;
		}

		// setFirstTime(false);
		setNumberOfBomb(numOfBomb);
		setGameOver(false);
		setPlayerWon(false);

		let arr = Array(gridSize)
			.fill(0)
			.map((item) =>
				Array(gridSize).fill({
					val: 0,
					id: '',
					open: false,
					flagged: false,
					show: false,
				})
			);

		for (let i = 0; i < gridSize; i++) {
			for (let j = 0; j < gridSize; j++) {
				arr[i][j] = {
					...arr[i][j],
					id: idGenerator(),
				};
			}
		}

		while (numOfBomb) {
			ran1 = Math.floor(Math.random() * gridSize);
			ran2 = Math.floor(Math.random() * gridSize);
			if (arr[ran1][ran2] === -1) continue;
			arr[ran1][ran2] = {
				...arr[ran1][ran2],
				val: -1,
			};
			numOfBomb--;
		}

		// arr[0][0].val = arr[0][1].val = arr[0][2].val = arr[1][0].val = arr[1][2].val = arr[2][0].val = arr[2][1].val = arr[2][2].val = -1;
		for (let i = 0; i < gridSize; i++) {
			for (let j = 0; j < gridSize; j++) {
				if (arr[i][j].val === 0) {
					arr[i][j] = {
						...arr[i][j],
						val: changeValueBasedOnNeighbour(arr, i, j, gridSize),
					};
				}
			}
		}

		// for (let i = 0; i < gridSize; i++) {
		// 	for (let j = 0; j < gridSize; j++) {
		// 		arr[i][j].val = 0;
		// 	}
		// }

		setArray(arr);
	};

	const clearArea = (arr, i, j, n) => {
		if (arr[i][j].val === 0) {
			if (arr[i][j].open === false) arr[i][j].open = true;

			if (i > 0 && i < n - 1 && j > 0 && j < n - 1) {
				if (arr[i - 1][j - 1].open === false)
					clearArea(arr, i - 1, j - 1, n); //top-left
				if (arr[i - 1][j].open === false) clearArea(arr, i - 1, j, n); //top
				if (arr[i - 1][j + 1].open === false)
					clearArea(arr, i - 1, j + 1, n); //top-right

				if (arr[i][j - 1].open === false) clearArea(arr, i, j - 1, n); //left
				if (arr[i][j + 1].open === false) clearArea(arr, i, j + 1, n); //right

				if (arr[i + 1][j - 1].open === false)
					clearArea(arr, i + 1, j - 1, n); //bottom-left
				if (arr[i + 1][j].open === false) clearArea(arr, i + 1, j, n); //bottom
				if (arr[i + 1][j + 1].open === false)
					clearArea(arr, i + 1, j + 1, n); //bottom-right
			} else if (i === 0 && j === 0) {
				if (arr[i][j + 1].open === false) clearArea(arr, i, j + 1, n); //right
				if (arr[i + 1][j + 1].open === false)
					clearArea(arr, i + 1, j + 1, n); //bottom-right
				if (arr[i + 1][j].open === false) clearArea(arr, i + 1, j, n); //bottom
			} else if (i === 0 && j === n - 1) {
				if (arr[i][j - 1].open === false) clearArea(arr, i, j - 1, n); //left
				if (arr[i + 1][j - 1].open === false)
					clearArea(arr, i + 1, j - 1, n); //bottom-left
				if (arr[i + 1][j].open === false) clearArea(arr, i + 1, j, n); //bottom
			} else if (i === n - 1 && j === 0) {
				if (arr[i - 1][j].open === false) clearArea(arr, i - 1, j, n); //top
				if (arr[i - 1][j + 1].open === false)
					clearArea(arr, i - 1, j + 1, n); //top-right
				if (arr[i][j + 1].open === false) clearArea(arr, i, j + 1, n); //right
			} else if (i === n - 1 && j === n - 1) {
				if (arr[i - 1][j].open === false) clearArea(arr, i - 1, j, n); //top
				if (arr[i - 1][j - 1].open === false)
					clearArea(arr, i - 1, j - 1, n); //top-left
				if (arr[i][j - 1].open === false) clearArea(arr, i, j - 1, n); //left
			} else if (i === 0 && j > 0 && j < n - 1) {
				if (arr[i][j - 1].open === false) clearArea(arr, i, j - 1, n); //left
				if (arr[i][j + 1].open === false) clearArea(arr, i, j + 1, n); //right

				if (arr[i + 1][j - 1].open === false)
					clearArea(arr, i + 1, j - 1, n); //bottom-left
				if (arr[i + 1][j].open === false) clearArea(arr, i + 1, j, n); //bottom
				if (arr[i + 1][j + 1].open === false)
					clearArea(arr, i + 1, j + 1, n); //bottom-right
			} else if (i > 0 && i < n - 1 && j === 0) {
				if (arr[i - 1][j].open === false) clearArea(arr, i - 1, j, n); //top
				if (arr[i - 1][j + 1].open === false)
					clearArea(arr, i - 1, j + 1, n); //top-right
				if (arr[i][j + 1].open === false) clearArea(arr, i, j + 1, n); //right
				if (arr[i + 1][j + 1].open === false)
					clearArea(arr, i + 1, j + 1, n); //bottom-right
				if (arr[i + 1][j].open === false) clearArea(arr, i + 1, j, n); //bottom
			} else if (i > 0 && i < n - 1 && j === n - 1) {
				if (arr[i - 1][j].open === false) clearArea(arr, i - 1, j, n); //top
				if (arr[i - 1][j - 1].open === false)
					clearArea(arr, i - 1, j - 1, n); //top-left
				if (arr[i][j - 1].open === false) clearArea(arr, i, j - 1, n); //left
				if (arr[i + 1][j - 1].open === false)
					clearArea(arr, i + 1, j - 1, n); //bottom-left
				if (arr[i + 1][j].open === false) clearArea(arr, i + 1, j, n); //bottom
			} else if (i === n - 1 && j > 0 && j < n - 1) {
				if (arr[i - 1][j - 1].open === false)
					clearArea(arr, i - 1, j - 1, n); //top-left
				if (arr[i - 1][j].open === false) clearArea(arr, i - 1, j, n); //top
				if (arr[i - 1][j + 1].open === false)
					clearArea(arr, i - 1, j + 1, n); //top-right

				if (arr[i][j - 1].open === false) clearArea(arr, i, j - 1, n); //left
				if (arr[i][j + 1].open === false) clearArea(arr, i, j + 1, n); //right
			}
		}
	};

	const showBoundaries = (arr, n) => {
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < arr[i].length; j++) {
				if (arr[i][j].val === 0 && arr[i][j].open) {
					if (i > 0 && i < n - 1 && j > 0 && j < n - 1) {
						if (arr[i - 1][j - 1].val > 0)
							//top-left
							arr[i - 1][j - 1] = {
								...arr[i - 1][j - 1],
								show: true,
								open: true,
							};
						if (arr[i - 1][j].val > 0)
							//top
							arr[i - 1][j] = {
								...arr[i - 1][j],
								show: true,
								open: true,
							};
						if (arr[i - 1][j + 1].val > 0)
							//top-right
							arr[i - 1][j + 1] = {
								...arr[i - 1][j + 1],
								show: true,
								open: true,
							};

						if (arr[i][j - 1].val > 0)
							//left
							arr[i][j - 1] = {
								...arr[i][j - 1],
								show: true,
								open: true,
							};
						if (arr[i][j + 1].val > 0)
							//right
							arr[i][j + 1] = {
								...arr[i][j + 1],
								show: true,
								open: true,
							};

						if (arr[i + 1][j - 1].val > 0)
							//bottom-left
							arr[i + 1][j - 1] = {
								...arr[i + 1][j - 1],
								show: true,
								open: true,
							};
						if (arr[i + 1][j].val > 0)
							//bottom
							arr[i + 1][j] = {
								...arr[i + 1][j],
								show: true,
								open: true,
							};
						if (arr[i + 1][j + 1].val > 0)
							//bottom-right
							arr[i + 1][j + 1] = {
								...arr[i + 1][j + 1],
								show: true,
								open: true,
							};
					} else if (i === 0 && j === 0) {
						if (arr[i][j + 1].val > 0)
							//right
							arr[i][j + 1] = {
								...arr[i][j + 1],
								show: true,
								open: true,
							};
						if (arr[i + 1][j + 1].val > 0)
							//bottom-right
							arr[i + 1][j + 1] = {
								...arr[i + 1][j + 1],
								show: true,
								open: true,
							};
						if (arr[i + 1][j].val > 0)
							//bottom
							arr[i + 1][j] = {
								...arr[i + 1][j],
								show: true,
								open: true,
							};
					} else if (i === 0 && j === n - 1) {
						if (arr[i][j - 1].val > 0)
							//left
							arr[i][j - 1] = {
								...arr[i][j - 1],
								show: true,
								open: true,
							};
						if (arr[i + 1][j - 1].val > 0)
							//bottom-left
							arr[i + 1][j - 1] = {
								...arr[i + 1][j - 1],
								show: true,
								open: true,
							};
						if (arr[i + 1][j].val > 0)
							//bottom
							arr[i + 1][j] = {
								...arr[i + 1][j],
								show: true,
								open: true,
							};
					} else if (i === n - 1 && j === 0) {
						if (arr[i - 1][j].val > 0)
							//top
							arr[i - 1][j] = {
								...arr[i - 1][j],
								show: true,
								open: true,
							};
						if (arr[i - 1][j + 1].val > 0)
							//top-right
							arr[i - 1][j + 1] = {
								...arr[i - 1][j + 1],
								show: true,
								open: true,
							};
						if (arr[i][j + 1].val > 0)
							//right
							arr[i][j + 1] = {
								...arr[i][j + 1],
								show: true,
								open: true,
							};
					} else if (i === n - 1 && j === n - 1) {
						if (arr[i - 1][j].val > 0)
							//top
							arr[i - 1][j] = {
								...arr[i - 1][j],
								show: true,
								open: true,
							};
						if (arr[i - 1][j - 1].val > 0)
							//top-left
							arr[i - 1][j - 1] = {
								...arr[i - 1][j - 1],
								show: true,
								open: true,
							};
						if (arr[i][j - 1].val > 0)
							//left
							arr[i][j - 1] = {
								...arr[i][j - 1],
								show: true,
								open: true,
							};
					} else if (i === 0 && j > 0 && j < n - 1) {
						if (arr[i][j - 1].val > 0)
							//left
							arr[i][j - 1] = {
								...arr[i][j - 1],
								show: true,
								open: true,
							};
						if (arr[i][j + 1].val > 0)
							//right
							arr[i][j + 1] = {
								...arr[i][j + 1],
								show: true,
								open: true,
							};

						if (arr[i + 1][j - 1].val > 0)
							//bottom-left
							arr[i + 1][j - 1] = {
								...arr[i + 1][j - 1],
								show: true,
								open: true,
							};
						if (arr[i + 1][j].val > 0)
							//bottom
							arr[i + 1][j] = {
								...arr[i + 1][j],
								show: true,
								open: true,
							};
						if (arr[i + 1][j + 1].val > 0)
							//bottom-right
							arr[i + 1][j + 1] = {
								...arr[i + 1][j + 1],
								show: true,
								open: true,
							};
					} else if (i > 0 && i < n - 1 && j === 0) {
						if (arr[i - 1][j].val > 0)
							//top
							arr[i - 1][j] = {
								...arr[i - 1][j],
								show: true,
								open: true,
							};
						if (arr[i - 1][j + 1].val > 0)
							//top-right
							arr[i - 1][j + 1] = {
								...arr[i - 1][j + 1],
								show: true,
								open: true,
							};
						if (arr[i][j + 1].val > 0)
							//right
							arr[i][j + 1] = {
								...arr[i][j + 1],
								show: true,
								open: true,
							};
						if (arr[i + 1][j + 1].val > 0)
							//bottom-right
							arr[i + 1][j + 1] = {
								...arr[i + 1][j + 1],
								show: true,
								open: true,
							};
						if (arr[i + 1][j].val > 0)
							//bottom
							arr[i + 1][j] = {
								...arr[i + 1][j],
								show: true,
								open: true,
							};
					} else if (i > 0 && i < n - 1 && j === n - 1) {
						if (arr[i - 1][j].val > 0)
							//top
							arr[i - 1][j] = {
								...arr[i - 1][j],
								show: true,
								open: true,
							};
						if (arr[i - 1][j - 1].val > 0)
							//top-left
							arr[i - 1][j - 1] = {
								...arr[i - 1][j - 1],
								show: true,
								open: true,
							};
						if (arr[i][j - 1].val > 0)
							//left
							arr[i][j - 1] = {
								...arr[i][j - 1],
								show: true,
								open: true,
							};
						if (arr[i + 1][j - 1].val > 0)
							//bottom-left
							arr[i + 1][j - 1] = {
								...arr[i + 1][j - 1],
								show: true,
								open: true,
							};
						if (arr[i + 1][j].val > 0)
							//bottom
							arr[i + 1][j] = {
								...arr[i + 1][j],
								show: true,
								open: true,
							};
					} else if (i === n - 1 && j > 0 && j < n - 1) {
						if (arr[i - 1][j - 1].val > 0)
							//top-left
							arr[i - 1][j - 1] = {
								...arr[i - 1][j - 1],
								show: true,
								open: true,
							};
						if (arr[i - 1][j].val > 0)
							//top
							arr[i - 1][j] = {
								...arr[i - 1][j],
								show: true,
								open: true,
							};
						if (arr[i - 1][j + 1].val > 0)
							//top-right
							arr[i - 1][j + 1] = {
								...arr[i - 1][j + 1],
								show: true,
								open: true,
							};
						if (arr[i][j - 1].val > 0)
							//left
							arr[i][j - 1] = {
								...arr[i][j - 1],
								show: true,
								open: true,
							};
						if (arr[i][j + 1].val > 0)
							//right
							arr[i][j + 1] = {
								...arr[i][j + 1],
								show: true,
								open: true,
							};
					}

					//
					clearArea(arr, i, j, n);
				}
			}
		}
	};

	const checkWinStatus = (arr) => {
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < arr[i].length; j++) {
				if (arr[i][j].val >= 0) {
					if (arr[i][j].open || arr[i][j].show) {
						continue;
					}
					console.log(`SAAS [${i}][${j}]`);
					return;
				}
			}
		}

		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < arr[i].length; j++) {
				if (arr[i][j].val < 0) {
					if (arr[i][j].flagged) {
						continue;
					}
					console.log(`DONE [${i}][${j}]`);
					return;
				}
			}
		}

		setPlayerWon(true);
		console.log('WON');
	};

	const searchByIdAndOpenIt = (id) => {
		let arr = array;
		for (let i = 0; i < arr.length; i++) {
			let found = false;
			for (let j = 0; j < arr[i].length; j++) {
				if (arr[i][j].id === id) {
					// console.log(i, j);
					if (openFlag) {
						//player choosed for opening the mine
						if (arr[i][j].val === -1) {
							//may be the mine contains bomb
							console.log('Game Over');
							setGameOver(true);
						} else if (!arr[i][j].flagged && !arr[i][j].open) {
							// clear extra area arround the opened block...
							clearArea(arr, i, j, arr.length);

							// show other helpful elements...
							showBoundaries(arr, arr.length);

							arr[i][j] = {
								...arr[i][j],
								open: true,
							};
						}
					} else {
						//player want to flag the mine spot...
						if (arr[i][j].open === false) {
							// if and only if the spot is available then proceed...
							arr[i][j] = {
								...arr[i][j],
								flagged: !arr[i][j].flagged,
							};
							const currBomb = numOfBomb;
							setNumberOfBomb(currBomb - 1);
						}
					}
					found = true;
					break;
				}
			}

			if (found) break;
		}

		setArray(arr);
		// console.table(array);

		const currr = temp;
		setTempValue(!currr);

		// check if the player won or not...
		checkWinStatus(array);
	};

	// gameover ? (rowItem === -1 ? "#4040ef": color) : (rowItem.flagged === true ? "#dfdfdf":color),
	let autoKey = 0;
	return (
		<div className={`fullminedash ${props.theme}`}>
			<div>
				<h3>
					{'Bombs: '}
					{numOfBomb}
				</h3>
			</div>
			<div className={`minecard ${props.theme}`}>
				<>
					{array.map((item, _) => {
						return (
							<div className='row' key={autoKey++}>
								{item.map((rowItem, __) => {
									let currcolor = color;
									if (gameover) {
										if (rowItem.val === -1) {
											currcolor = '#df4040';
										}
									} else {
										// console.log('OPEN', rowItem.open);
										if (rowItem.open) {
											currcolor = 'transparent';
										} else if (rowItem.flagged) {
											currcolor = '#ff4500';
										}
									}

									return (
										<div
											onClick={() => {
												if (!gameover)
													searchByIdAndOpenIt(
														rowItem.id
													);
											}}
											style={{
												backgroundColor: currcolor,
												color:
													props.theme === 'light'
														? '#000000'
														: colorIsLight(color)
														? '#000000'
														: '#ffffff',
											}}
											className='rowele'
											key={rowItem.id}
										>
											{(rowItem.val > 0 &&
											rowItem.open &&
											rowItem.show) || rowItem.val === -1
												? rowItem.val
												: ''}
											{/* {rowItem.val > 0 ? rowItem.val : ''} */}
											{/* {rowItem.val} */}
										</div>
									);
								})}
							</div>
						);
					})}
				</>
			</div>
			<div className='menu'>
				<div className='color-chooser play-toggle'>
					<Pickaxe
						color={color}
						enabled={openFlag}
						theme={props.theme}
						onClickflag={() => {
							setOpenFlag(true);
						}}
					/>
					<Flag
						color={color}
						enabled={openFlag}
						theme={props.theme}
						onClickflag={() => {
							setOpenFlag(false);
						}}
					/>
				</div>
				<div className='color-chooser play-menu'>
					<div className='restart'>
						<Retry
							color={color}
							onClickThis={() => suffleGrid(6)}
						/>
					</div>
					<div className='pause'>
						<Pause color={color} />
					</div>
					<div
						style={{ border: `3px solid ${color}` }}
						className='circle'
						onClick={props.toggleAnimation}
					></div>
				</div>
				<div className='color-chooser'>
					<div
						className={`color blue ${
							color === '#0f60b6' ? 'yes' : 'no'
						}`}
						onClick={() => {
							setColor('#0f60b6');
						}}
					></div>
					<div
						className={`color green ${
							color === '#40ef40' ? 'yes' : 'no'
						}`}
						onClick={() => {
							setColor('#40ef40');
						}}
					></div>
					<div
						className={`color yellow ${
							color === '#faa300' ? 'yes' : 'no'
						}`}
						onClick={() => {
							setColor('#faa300');
						}}
					></div>
					<div
						className={`color pink ${
							color === '#ff8484' ? 'yes' : 'no'
						}`}
						onClick={() => {
							setColor('#ff8484');
						}}
					></div>
					<div
						className={`color purple ${
							color === '#4040ef' ? 'yes' : 'no'
						}`}
						onClick={() => {
							setColor('#4040ef');
						}}
					></div>
				</div>
			</div>
			<div>
				{temp ? '' : null}
				{/* <Winned
					theme={props.theme}
					setGameToInitial={() => {
						setGameOver(false);
						setPlayerWon(false);
						suffleGrid(3);
					}}
				/> */}
				{playerWon ? (
					<Winned
						theme={props.theme}
						setGameToInitial={() => {
							suffleGrid(2);
						}}
					/>
				) : gameover ? (
					<Gameovered
						theme={props.theme}
						setGameToInitial={() => {
							suffleGrid(2);
						}}
					/>
				) : null}
			</div>
		</div>
	);
}

export default Minesweeper;
