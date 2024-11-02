"use client";

import { useEffect, useState } from "react";

const getRoundsArray = (roundWon, totalRounds) =>
	Array.from({ length: totalRounds }, (_, i) => (i < roundWon ? 1 : 0));

const gameStates = {
	buy: 30,
	fight: 100,
	spike: 45,
	post: 6,
	idle: 0,
};
// format --:--
const convertSecondsToTime = (seconds) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	// 00:00 format
	return { text: `${minutes.toString().padStart(2, "0")}:${remainingSeconds
		.toString()
		.padStart(2, "0")}`, color: seconds > 15 ? "text-white" : "text-red-500" };
};

const Page = () => {
	const [gameState, setGameState] = useState({
		round: 0,
		stage: "idle",
		switchSides: false,
		spike_down: false,
		total_games: 3,
		team_1: {
			abbr: "",
			seed: "",
			icon: "",
			won: 0,
			score: 0,
		},
		team_2: {
			abbr: "",
			seed: "",
			icon: "",
			won: 0,
			score: 0,
		},
	});

	const [timer, setTimer] = useState({
		text: ":--:--",
		color: "text-white",
	});

	const [roundWonDots, setRoundWonDots] = useState({
		team1: [],
		team2: [],
	});

	useEffect(() => {
		const setData = async () => {
			const res = await fetch("http://localhost:3002/data");
			const data = await res.json();
			setGameState(data);
		};
		setData();
		setInterval(() => {
			setData();
		}, 250);
	}, []);

	useEffect(() => {
		let time = gameStates[gameState.stage] ?? 0;
		setTimer(convertSecondsToTime(time));
		const interval = setInterval(() => {
			if (time > 0) {
				time--;
				setTimer(convertSecondsToTime(time));
			} else {
				clearInterval(interval);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [gameState.stage]);

	useEffect(() => {
		setRoundWonDots({
			team1: getRoundsArray(
				gameState.team_1.won,
				Math.ceil(gameState.total_games / 2)
			),
			team2: getRoundsArray(
				gameState.team_2.won,
				Math.ceil(gameState.total_games / 2)
			),
		});
	}, [gameState.total_games, gameState.team_1.won, gameState.team_2.won]);

	return (
		<>
			<div id="left-team" className={`team-container mr-2 left-team ${gameState.switchSides ? "red-team" : "green-team"}`}>
				<div className="team-information-container">
					<img
						className="team-icon"
						src={gameState.team_1.icon || "blue.jpg"}
						alt=""
					/>
					<span className="team-name-and-seed">
						<span className="name">{gameState.team_1.abbr}</span>
						<span className="seed">{gameState.team_1.seed}</span>
					</span>
				</div>
				<div className="color-separator-bar"></div>
				<div className="score-holder">
					<span className="score">{gameState.team_1.score}</span>
				</div>
			</div>

			<div className="central-game-timer">
				<span id="round-counter" className="round-counter">
					Round {gameState.round}
				</span>
				{/* <span className="timer" id="timer">
					<span className={timer.color}>{timer.text}</span>
				</span> */}
			</div>

			<div className="spike-container">
				<div className={`attack-indicator left-pol ${gameState.switchSides ? "opacity-100" : "opacity-0"}`}></div>
				<div id="spike" className="spike-image"></div>
				<div className={`attack-indicator right-pol ${gameState.switchSides ? "opacity-0`" : "opacity-100"}`}></div>
			</div>

			<div className="maps-won-container">
				<div className="flex gap-2">
					{roundWonDots.team1.map((dot, i) => (
						<div
							className={`map-won-point ${dot ? "full-point" : ""
								}`}
							key={i}></div>
					))}
				</div>
				<div className="flex gap-2">
					{roundWonDots.team2.map((dot, i) => (
						<div
							className={`map-won-point ${dot ? "full-point" : ""
								}`}
							key={i}></div>
					))}
				</div>
			</div>

			<div id="right-team" className={`team-container ml-2 right-team ${gameState.switchSides ? "green-team" : "red-team"}`}>
				<div className="team-information-container">
					<img
						className="team-icon"
						src={gameState.team_2.icon || "red.jpg"}
						alt=""
					/>
					<span className="team-name-and-seed">
						<span className="name">{gameState.team_2.abbr}</span>
						<span className="seed">{gameState.team_2.seed}</span>
					</span>
				</div>
				<div className="color-separator-bar"></div>
				<div className="score-holder">
					<span className="score">{gameState.team_2.score}</span>
				</div>
			</div>
		</>
	);
};

export default Page;
