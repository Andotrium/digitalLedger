function validateJournalEntry(entry){
    if(entry.length < 2){
        throw new Error("Journal entry must have at least two lines.");
    }
    let debitSum = 0; // increase in assets or decrease in liabilities
    let creditSum = 0; // increase in liabilities or decrease in assets

    for(const line of entry){
        debitSum += line.debit || 0;
        creditSum += line.credit || 0;
    }
    if(debitSum !== creditSum){
        throw new Error("Journal entry is not balanced: total debits must equal total credits.");
    }
}
module.exports = { validateJournalEntry };