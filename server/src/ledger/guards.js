const {getBalance} = require('./getBalance.js');

async function ensureSufficientFunds(accountId, amount){
    const balance = await getBalance(accountId);
    if(balance < amount){
        throw new Error("Insufficient funds");
    }
    console.log(balance);

}
module.exports = {ensureSufficientFunds};