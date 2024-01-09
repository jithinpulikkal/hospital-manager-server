const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
    employeeName: { 
        type: String, 
        required: true 
    },
    employeeNumber: { 
        type: Number, 
        required: true 
    },
    age: { 
        type: Number, 
        required: true 
    },
    profileImg: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    department: {
        type: String,
        required: true,
    },
});

module.exports = new mongoose.model("employees", employeeSchema);
