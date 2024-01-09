const mongoose = require("mongoose");

const deptSchema = mongoose.Schema({
    deptName: {
        type: String,
        required: true,
    },
    yearFounded: {
        type: Number,
        required: true,
    },
    deptImg: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const departments = mongoose.model("departments", deptSchema);

module.exports = departments;
