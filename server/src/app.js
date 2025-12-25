const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes");
const ledgerRoutes = require("./routes/ledger.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/ledger", ledgerRoutes);

module.exports = app;
