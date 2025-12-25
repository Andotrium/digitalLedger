const express = require('express');
const Account = require('../models/Account')
async function createDefaultAccount(user){
    const accounts = [];
    if(user.role === 'INVESTOR'){
        accounts.push({
            name: `${user.name}'s Investor Wallet`,
            owner: user._id,
            type: 'INVESTOR_WALLET',
            asset: 'COMPANY_X_SHARES'
        })
    }
    if(user.role === 'ISSUER'){
        const exist = await Account.findOne({owner: user._id, type: 'TREASURY'});
        if(exist){
            return ;
        }
        accounts.push({
            name: `Issuer Treasury Account`,
            owner: user._id,
            type: 'TREASURY',
            asset: 'COMPANY_X_SHARES'
        })
    }

    if(accounts.length > 0){
        try {
            await Account.insertMany(accounts);
        }catch(error){
            console.error("Error creating default accounts:", error);

        }
    }
}

module.exports = {createDefaultAccount};