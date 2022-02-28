const inquirer = require('inquirer');
const figlet = require('figlet');
const chalk = require('chalk');
const { Keypair } = require('@solana/web3.js');
const { transferSOL } = require('./solana.js');
const { randomNumber, totalAmtToBePaid, getReturnAmount } = require('./helper.js');


const userSecretKey = [
    13,  57, 126,  67, 207, 168, 232,   6, 154, 221,  28,
   117,  54,   2, 253,  44, 172, 167, 129,  61, 157, 253,
   219,  87,  53, 216, 242,  23, 140, 255,  13,   0, 255,
   225,   1, 102, 228,  90, 100,  64, 241, 246, 161,   1,
   112, 109, 179, 255, 140, 229, 225, 231,  18, 139,  47,
   134,  22, 180, 235, 215, 137, 153,  85, 251
 ];
const userWallet=Keypair.fromSecretKey(Uint8Array.from(userSecretKey));


const treasurySecretKey = [
    80,   2, 126,  73, 163,  27, 194, 164, 248, 160,  31,
    251,  55,  96, 164, 214, 150,  50, 106,  57,  71,  56,
    179, 151,  42, 129, 135,  26,  80,  88, 154, 218,  80,
    27,  97, 194, 244,  75, 129, 155, 231, 254, 207, 176,
    244,  46,  48, 220,  37, 143, 216, 214, 101,  30,  25,
    240, 181, 188, 218, 136, 103,  46, 140,  63
];
const treasuryWallet=Keypair.fromSecretKey(Uint8Array.from(treasurySecretKey));

const gameExecution = async ()=> {
    console.log(chalk.green(figlet.textSync('SOL Stake', {font:"Standard"})));
    console.log(chalk.yellow(`The max bidding amount is 2.5 SOL here`));

    // Asking the user for details
    answers = await inquirer.prompt([
        {
            name: "SOL",
            type: "number",
            message: "What is the amount of SOL you want to stake?",
        },
        {
            name: "RATIO",
            type: "rawlist",
            message: "What is the ratio of your staking?",
            choices: ["1:1.25", "1:1.5"],
            filter: (answer) => answer.split(':')[1]
        },
    ]);

    price = totalAmtToBePaid(answers.SOL);
    reward = getReturnAmount(answers.SOL, parseFloat(answers.RATIO));


    console.log(`You need to pay ${chalk.green(price)} to move forward`);
    console.log(chalk.green(`You will get ${reward} if guessing the number correctly`));

    answers = await inquirer.prompt({
        name:"GUESS",
        type:"number",
        message:"Guess a random number from 1 to 5 (both 1, 5 included)",
    });

    // Transaction for playing.
    paymentTransaction = await transferSOL(userWallet, treasuryWallet, price);
    console.log(`Signature of payment for playing the game ${chalk.green(paymentTransaction)}`);

    roulleteNumber = randomNumber(1, 6);

    if (roulleteNumber == answers.GUESS) {
        console.log(chalk.green(`Your guess is absolutely correct`));
        rewardTransaction = await transferSOL(userWallet, treasuryWallet, price);
        console.log(`Here is the price signature  ${chalk.green(rewardTransaction)}`);
    } else {
        console.log(chalk.yellow('Better luck next time'));
    }

}

gameExecution();