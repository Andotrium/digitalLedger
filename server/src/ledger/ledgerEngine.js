const JournalEntry = require('../models/JournalEntry');
const {validateJournalEntry} = require('./validators');
const {ensureSufficientFunds} = require('./guards.js');

async function postJournalEntry({reason, lines}){
    validateJournalEntry(lines);
    const entry = new JournalEntry({reason, lines});
    await entry.save();
    return entry;
}

async function transferEquity({
  fromAccount,
  toAccount,
  amount
}) {
  await ensureSufficientFunds(fromAccount, amount);

  return postJournalEntry({
    reason: "Equity Transfer",
    lines: [
      { account: toAccount, debit: amount },
      { account: fromAccount, credit: amount }
    ]
  });
}


module.exports = { postJournalEntry, transferEquity };