const mongoose = require('mongoose');

const journalLineSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    debit: {
        type: Number,
        default: 0,
    },
    credit: {
        type: Number,
        default: 0,
    }
});
// increase in assets = debit, increase in liabilities = credit -> of the system

const JournalEntrySchema = new mongoose.Schema({
    reason: String,
    Timestamp: {
        type: Date,
        default: Date.now
    },
    lines: [journalLineSchema]
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);