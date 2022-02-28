const randomNumber = (min, max) => {
    return Math.floor(Math.random() * max + min);
}

const getReturnAmount = (stakedAmount, ratio) => {
    return stakedAmount * ratio;
}

const totalAmtToBePaid = (stakedAmount) => {
    const feeFactorial = 1.05;
    return stakedAmount * feeFactorial;
}

module.exports = {
    randomNumber,
    getReturnAmount,
    totalAmtToBePaid
}