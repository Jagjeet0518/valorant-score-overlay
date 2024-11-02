"use client";

import { useEffect, useState } from "react";

const gameStates = {
	buy: 30,
	fight: 100,
	spike: 45,
	post: 6,
	idle: 0,
};

const convertSecondsToTime = (seconds) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	// 00:00 format
	return { text: `${minutes.toString().padStart(2, "0")}:${remainingSeconds
		.toString()
		.padStart(2, "0")}`, color: seconds > 15 ? "text-white" : "text-red-500" };
};

const Page = () => {

    const [timer, setTimer] = useState({
		text: ":--:--",
		color: "text-white",
	});
    const [stage, setStage] = useState(null);
    const [round, setRound] = useState(null);
    const [team1, setTeam1] = useState({
        icon: "",
        abbr: "",
        seed: "",
        won: 0,
        score: 0,
    });
    const [team2, setTeam2] = useState({
        icon: "",
        abbr: "",
        seed: "",
        won: 0,
        score: 0,
    });

    const setData = async () => {
        const res = await fetch("http://localhost:3002/data");
        const data = await res.json();
        setStage(data.stage);
        setRound(data.round);
        setTeam1(data.team_1);
        setTeam2(data.team_2);
    };

    useEffect(() => {
        setData();
    }, []);

    useEffect(() => {
        let time = gameStates[stage] ?? 0;
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
	}, [stage]);

    useEffect(() => {
        const changeStage = async (stage) => {
            await fetch("http://localhost:3002/stage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    stage,
                }),
            });
        }
        changeStage(stage);
    }, [stage]);

    useEffect(() => {
        if (team1.score === null || team1.score === "") return;
        if (team1.won === null || team1.won === "") return;

        fetch("http://localhost:3002/team1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                team1,
            }),
        });
    }, [team1]);

    useEffect(() => {
        if (team2.score === null || team2.score === "") return;
        if (team2.won === null || team2.won === "") return;

        fetch("http://localhost:3002/team2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                team2,
            }),
        });
    }, [team2]);

    useEffect(() => {
        if (round ==  null || round == "") return;
        fetch("http://localhost:3002/round", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                round,
            }),
        });
    }, [round]);

    return (
        <main className="w-screen min-h-screen bg-gray-900 flex flex-col p-16 gap-4">
            <button className="bg-blue-500 rounded-md p-4 text-white" onClick={() => setData()}>
                Refresh
            </button>
            <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-700 text-white w-full">
                    <img src={team1.icon || "blue.jpg"} alt="" className="size-48 rounded-full object-cover" />
                    <div className="flex flex-col">
                        <h3>Team 1 Abbreviation</h3>
                        <input type="text" value={team1.abbr} className="text-xl font-bold rounded-md bg-gray-600 py-2 px-4 w-full" onChange={(e) => setTeam1({ ...team1, abbr: e.target.value })} />
                        <h3>Team 1 Seed</h3>
                        <input type="text" value={team1.seed} className="text-xl font-bold rounded-md bg-gray-600 py-2 px-4 w-full" onChange={(e) => setTeam1({ ...team1, seed: e.target.value })} />
                        <h3>Team 1 Score</h3>
                        <input type="number" value={team1.score} className="text-xl font-bold rounded-md bg-gray-600 py-2 px-4 w-full" onChange={(e) => setTeam1({ ...team1, score: e.target.value })} />
                        <h3>Team 1 Won Games</h3>
                        <input type="number" value={team1.won} className="text-xl font-bold rounded-md bg-gray-600 py-2 px-4 w-full" onChange={(e) => setTeam1({ ...team1, won: e.target.value })} />
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-700 text-white w-full">
                    <img src={team2.icon || "red.jpg"} alt="" className="size-48 rounded-full object-cover" />
                    <div className="flex flex-col">
                        <h3>Team 2 Abbreviation</h3>
                        <input type="text" value={team2.abbr} className="text-xl font-bold rounded-md bg-gray-600 py-2 px-4 w-full" onChange={(e) => setTeam2({ ...team2, abbr: e.target.value })} />
                        <h3>Team 2 Seed</h3>
                        <input type="text" value={team2.seed} className="text-xl font-bold rounded-md bg-gray-600 py-2 px-4 w-full" onChange={(e) => setTeam2({ ...team2, seed: e.target.value })} />
                        <h3>Team 2 Score</h3>
                        <input type="number" value={team2.score} className="text-xl font-bold rounded-md bg-gray-600 py-2 px-4 w-full" onChange={(e) => setTeam2({ ...team2, score: e.target.value })} />
                        <h3>Team 2 Won Games</h3>
                        <input type="number" value={team2.won} className="text-xl font-bold rounded-md bg-gray-600 py-2 px-4 w-full" onChange={(e) => setTeam2({ ...team2, won: e.target.value })} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 p-4 place-content-start rounded-lg bg-neutral-700 text-white w-full">
                    <div className="bg-teal-800 text-white p-4 rounded-lg w-full col-span-2 h-full">
                        <h2 className="text-center text-5xl font-bold">
                            {timer.text}
                        </h2>
                        <h4 className="text-center text-xl font-semibold">
                            {stage ?? ""}
                        </h4>
                    </div>
                    <div className="flex flex-col gap-2 h-fit">
                        <h3>Round :</h3>
                        <input type="number" value={round} className="text-xl font-bold rounded-md bg-gray-600 py-2 px-4 w-full" onChange={(e) => setRound(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2 h-fit">
                        <h3>Stage :</h3>
                        <select value={stage} className="text-xl font-bold rounded-md bg-gray-600 py-2 px-4 w-full" onChange={(e) => setStage(e.target.value)}>
                            <option value="idle">Idle</option>
                            <option value="buy">Buy</option>
                            <option value="fight">Fight</option>
                            <option value="spike">Spike</option>
                            <option value="post">Post</option>
                        </select>
                    </div>
                    <button className="bg-green-600 rounded-md p-3 text-white w-full col-span-2">
                        Switch Sides
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Page;