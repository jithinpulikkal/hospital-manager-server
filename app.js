const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const adminRouter = require("./routes/admin");

app.listen(3001, () => {
    console.log("server started");
});

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

mongoose
    .connect("mongodb://localhost:27017/hospital", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("database connected");
    })
    .catch((error) => {
        console.log(error.message);
    });

app.use("/admin", adminRouter);

app.use(express.static(path.join(__dirname, "public")));
