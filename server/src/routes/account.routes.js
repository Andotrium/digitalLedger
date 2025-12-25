const express = require("express");
const auth = require("../middleware/auth");
const Account = require("../models/Account");
const { getBalance } = require("../ledger/getBalance.js");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const accounts = await Account.find({
      owner: req.user.id
    }).select("_id name type asset");

    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

router.get("/balance", auth, async(req, res) => {
  try {
    const account = await Account.findOne({ owner: req.user.id, type: "INVESTOR_WALLET" });
    if (!account) {
      return res.status(404).json({ error: "Investor wallet not found" });
    }
    const balance = await getBalance(account._id);
    res.json({ balance });
  }catch(error){
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
