// schema for user entries

const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;

const schemaEntry = new Schema({
    id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    startTime: {
        type: Number
    },
    endTime: {
        type: Number
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
});

const EntryModel = mongoose.model('Entries', schemaEntry);

module.exports = EntryModel;