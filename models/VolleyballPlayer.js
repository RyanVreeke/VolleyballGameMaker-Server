const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VolleyballPlayerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    wins: {
        type: Number,
    },
    losses: {
        type: Number,
    },
    pointDifferential: {
        type: Number,
    },
});

module.exports = mongoose.model('VolleyballPlayer', VolleyballPlayerSchema);
