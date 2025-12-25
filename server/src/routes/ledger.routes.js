const express = require('express');
const router = express.Router();
const {postJournalEntry, transferEquity} = require('../ledger/ledgerEngine.js');
const rbac = require('../middleware/rbac.js');
const Account = require('../models/Account.js');
const auth = require('../middleware/auth.js');
const User = require('../models/User.js');

router.post(
  "/issue",
  auth,
  rbac(["ISSUER"]),
  async (req, res) => {
    try {
      const { toUserEmail, amount } = req.body;

      if (!toUserEmail || !amount) {
        return res.status(400).json({
          error: "toUserEmail and amount are required"
        });
      }

      // 1️⃣ Find investor user
      const investorUser = await User.findOne({ email: toUserEmail });
      if (!investorUser) {
        return res.status(404).json({
          error: "Investor not found"
        });
      }

      // 2️⃣ Investor wallet
      const investorWallet = await Account.findOne({
        owner: investorUser._id,
        type: "INVESTOR_WALLET"
      });

      if (!investorWallet) {
        return res.status(400).json({
          error: "Investor wallet not found"
        });
      }

      // 3️⃣ Issuer treasury (from logged-in issuer)
      const treasuryAccount = await Account.findOne({
        owner: req.user.id,
        type: "TREASURY"
      });

      if (!treasuryAccount) {
        return res.status(400).json({
          error: "Issuer treasury not found"
        });
      }

      // 4️⃣ Create ledger entry (double-entry)
      const entry = await postJournalEntry({
        reason: "Equity Issuance",
        lines: [
          {
            account: investorWallet._id,
            debit: amount
          },
          {
            account: treasuryAccount._id,
            credit: amount
          }
        ]
      });

      res.json({
        message: "Equity issued successfully",
        journalEntryId: entry._id
      });
    } catch (err) {
      console.error("Error issuing journal entry:", err);
      res.status(500).json({
        error: err.message
      });
    }
  }
);

router.post(
  "/transfer",
  auth,
  rbac(["INVESTOR"]),
  async (req, res) => {
    const { toUserEmail, amount } = req.body;

    try {

      const senderAccount = await Account.findOne({
        owner: req.user.id,
        type: "INVESTOR_WALLET"
      });

      if (!senderAccount) {
        return res.status(404).json({ error: "Sender wallet not found" });
      }
      console.log("Sender Account:", senderAccount);
      //


      const receiverUser = await User.findOne({ email: toUserEmail });
      if (!receiverUser) {
        return res.status(404).json({ error: "Recipient not found" });
      }



      const receiverAccount = await Account.findOne({
        owner: receiverUser._id,
        type: "INVESTOR_WALLET"
      });

      if (!receiverAccount) {
        return res.status(404).json({ error: "Recipient wallet not found" });
      }
      console.log("Receiver wallet found", receiverAccount);
      console.log(receiverAccount.type);


      const entry = await transferEquity({
        fromAccount: senderAccount._id,
        toAccount: receiverAccount._id,
        amount
      });

      res.json({
        message: "Transfer successful",
        journalEntryId: entry._id
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);
module.exports = router;

