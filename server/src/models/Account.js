const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    name: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String,
        enum: ['TREASURY', 'ESCROW', 'INVESTOR_WALLET'],
        required: true
    },
    asset: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Account', accountSchema);
