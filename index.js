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
			error: "An error occurred while creating volleyball player.",
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
