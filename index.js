require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const VolleyballPlayer = require("./models/VolleyballPlayer");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/players", async (req, res) => {
	try {
		const data = await VolleyballPlayer.find({});
		res.json(data);
	} catch (error) {
		res.status(500).json({
			error: "An error occurred while fetching volleyball players.",
		});
	}
});

app.get("/api/players/:slug", async (req, res) => {
	try {
		const slugParam = req.params.slug;
		const data = await VolleyballPlayer.findOne({ _id: slugParam });

		if (!data) {
			throw new Error("An error occurred while fetching a player.");
		}

		res.json(data);
	} catch (error) {
		res.status(500).json({
			error: "An error occurred while fetching players.",
		});
	}
});

app.post("/api/players", async (req, res) => {
	try {
		console.log(req.body);

		const newPlayer = new VolleyballPlayer({
			name: req.body.name,
			wins: req.body.wins,
			losses: req.body.losses,
		});

		await VolleyballPlayer.create(newPlayer);
		res.json("Player created.");
	} catch (error) {
		res.status(500).json({
			error: "An error occurred while creating volleyball player.",
		});
	}
});

app.put("/api/players", async (req, res) => {
	try {
		console.log(req.body);

		const winningPlayers = req.body.winningTeamPlayers;
		const losingPlayers = req.body.losingTeamPlayers;

		// Update winning players
		await Promise.all(
			Object.entries(winningPlayers).map(async ([key, player]) => {
				console.log("Updating winning player:", key, player);
				const newWins = player.wins + 1;
				const updatedWinningPlayer = { wins: newWins };
				await VolleyballPlayer.findByIdAndUpdate(
					key,
					updatedWinningPlayer
				);
			})
		);

		// Update losing players
		await Promise.all(
			Object.entries(losingPlayers).map(async ([key, player]) => {
				console.log("Updating losing player:", key, player);
				const newLosses = player.losses + 1;
				const updatedLosingPlayer = { losses: newLosses };
				await VolleyballPlayer.findByIdAndUpdate(
					key,
					updatedLosingPlayer
				);
			})
		);

		res.json("Players updated.");
	} catch (error) {
		res.status(500).json({
			error: "An error occurred while updating volleyball players.",
		});
	}
});

app.put("/api/players/:slug", async (req, res) => {
	const slugParam = req.params.slug;

	try {
		console.log(req.body);

		const updatedPlayer = {
			name: req.body.name,
		};

		await VolleyballPlayer.findByIdAndUpdate(slugParam, updatedPlayer);
		res.json("Player updated.");
	} catch (error) {
		res.status(500).json({
			error: "An error occurred while updating volleyball player.",
		});
	}
});

app.put("/api/reset-players", async (req, res) => {
	try {
		await VolleyballPlayer.updateMany({}, { $set: { wins: 0, losses: 0 } });
		res.json("All player wins and losses reset to 0.");
	} catch (error) {
		console.error("Error resetting player stats:", error);
		res.status(500).json({
			error: "An error occurred while resetting player stats.",
		});
	}
});

app.delete("/api/players/:id", async (req, res) => {
	const playerId = req.params.id;

	try {
		await VolleyballPlayer.deleteOne({ _id: playerId });
		res.json(req.body.playerId);
	} catch (error) {
		res.json(error);
	}
});

app.get("*", (req, res) => {
	res.sendStatus("404");
});

app.listen(PORT, () => {
	console.log(`Server is running on PORT: ${PORT}`);
});
