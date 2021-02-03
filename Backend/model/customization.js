// schema for user customization

const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;

const schemaCustomization = new Schema({
    id: {
        type: String,
        required: true
    },
    font: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    border: {
        type: String,
        required: true
    }
});

const CustomizationModel = mongoose.model("Customizations", schemaCustomization);

module.exports = CustomizationModel;