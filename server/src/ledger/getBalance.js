const JournalEntry = require('../models/JournalEntry.js');

async function getBalance(accountId){
    const lines = await JournalEntry.find({"lines.account": accountId});
    let balance = 0;
    const acctIdStr = accountId && accountId.toString();
    for(const entry of lines){
        for(const line of entry.lines){
            if(line.account && line.account.toString() === acctIdStr){
                const debit = Number(line.debit) || 0;
                const credit = Number(line.credit) || 0;
                balance += debit;
                balance -= credit;
            }
        }
    }
    return balance;
}
module.exports = {getBalance};

