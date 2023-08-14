"use strict";
// THE BANK APP
// Data
const account1 = {
  owner: "Dhoniya Pata",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2023-07-11T23:36:17.929Z",
    "2023-07-17T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Peyaju Khan",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Chola Ahmed",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2023-07-11T23:36:17.929Z",
    "2023-07-17T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account4 = {
  owner: "Beguni Begum",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// PRINT USER DETAILS ON UI
let printText = "";
const loginDetails = accounts.map((acc) => {
  let user = acc.owner
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toLowerCase();
  let pin = acc.pin;

  return (printText += `| user: ${user}, pin: ${pin} |`);
});
window.alert("Login Details===> " + printText);

// DOM Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// * GLOBAL VARIABLES: INTERNATIONAL NUMBER FORMAT *
const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// * Formatting: MOVEMENTS DATES *
const formatMovDate = (dates, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  const daysPassed = calcDaysPassed(new Date(), dates);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "YesterDay";
  if (daysPassed <= 7) return `${daysPassed} Days Ago`;

  return new Intl.DateTimeFormat(locale).format(dates);
};
// * DOM Manipulation Start: MOVEMENTS *
const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((move, index) => {
    const formattedMov = formatCur(move, acc.locale, acc.currency);
    const movDate = new Date(acc.movementsDates[index]);
    const displayDate = formatMovDate(movDate, acc.locale);
    const moveType = move > 0 ? "deposit" : "withdrawal";
    const HTML = `<div class="movements__row">
    <div class="movements__type movements__type--${moveType}">${
      index + 1
    } ${moveType}</div>
    <div class="movements__date">${displayDate}</div>

    <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", HTML);
  });
};
// * DOM Manipulation Start: MOVEMENTS SUMMARY *
const calcDisplaySummary = (acc) => {
  const incomeMov = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, deposit) => acc + deposit, 0);

  const outcomeMov = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, withdraws) => acc + withdraws, 0);

  const interestMov = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit > 100 && deposit * acc.interestRate) / 100)
    .reduce((acc, interest) => acc + interest, 0);

  labelSumIn.textContent = formatCur(
    Math.abs(incomeMov),
    acc.locale,
    acc.currency
  );

  labelSumOut.textContent = formatCur(
    Math.abs(outcomeMov),
    acc.locale,
    acc.currency
  );

  labelSumInterest.textContent = formatCur(
    Math.abs(interestMov),
    acc.locale,
    acc.currency
  );
};

// * DOM Manipulation Start: ADDING TOTAL BALANCE *
const displayCalcBalance = (acc) => {
  acc.balances = acc.movements.reduce((acc, bal) => acc + bal, 0);

  labelBalance.textContent = formatCur(acc.balances, acc.locale, acc.currency);
};

// * Creating UserName on accounts *

const createUserName = (accounts) => {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((letter) => letter[0])
      .join("");
  });
};
createUserName(accounts);

let clearTimer;
// * DOM Manipulation Start: UPDATE UI *
const updateUI = (acc) => {
  displayMovements(acc);

  calcDisplaySummary(acc);

  displayCalcBalance(acc);

  if (clearTimer) clearInterval(clearTimer);
  clearTimer = startLogoutTimer();
};
// * SET LOGOUT TIMER *
const startLogoutTimer = () => {
  let timer = 180;

  const tick = () => {
    const min = String(Math.trunc(timer / 60)).padStart(2, 0);
    const sec = String(timer % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (timer === 0) {
      clearInterval(clearTimer);

      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    timer--;
  };
  tick();

  const clearTimer = setInterval(tick, 1000);
  return clearTimer;
};
// * DOM Manipulation Start: LOGIN WITH USERNAME AND PIN *
let currentAccount;
inputLoginUsername.value = inputLoginPin.value = "";

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  inputCloseUsername.value = inputClosePin.value = "";

  currentAccount = accounts.find(
    (acc) =>
      acc.username === inputLoginUsername.value &&
      acc.pin === +inputLoginPin.value
  );
  if (currentAccount) {
    // * DOM Manipulation Start: LABELLING DATE *
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(new Date());

    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 1;

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

// * DOM Manipulation Start: LOAN MONEY *
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    document.querySelector(".loan-text").textContent =
      "Your Request Has Been Processing";
    setTimeout(() => {
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
      document.querySelector(".loan-text").textContent = "Request Loan";
    }, 5000);
  }

  inputLoanAmount.value = "";
});
// * DOM Manipulation Start: TRANSFER MONEY TO OTHER USER *

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const transferAmount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    (acc) =>
      inputTransferTo.value === acc?.username &&
      inputTransferTo.value !== currentAccount.username
  );

  inputTransferTo.value = inputTransferAmount.value = "";
  if (
    transferAmount > 0 &&
    currentAccount.balances >= transferAmount &&
    receiverAccount
  ) {
    document.querySelector(".transfer-text").textContent =
      "Your Request Has Been Processing";
    setTimeout(() => {
      currentAccount.movements.push(-transferAmount);
      receiverAccount.movements.push(transferAmount);

      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
      document.querySelector(".transfer-text").textContent = "Transfer Money";
    }, 5000);
  }
});
// * DOM Manipulation Start: DELETE USER *
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    document.querySelector(".close-text").textContent =
      "We'll Delete Your Account In a Moment";
    setTimeout(() => {
      const deleteIndexNo = accounts.findIndex(
        (acc) => acc.username === currentAccount.username
      );
      accounts.splice(deleteIndexNo, 1);
      containerApp.style.opacity = 0;
      document.querySelector(".close-text").textContent = "Close Account";
    }, 5000);
  }
});
// * DOM Manipulation Start: SORTING BALANCE QUERY *
let sorting = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();

  displayMovements(currentAccount, !sorting);
  sorting = !sorting;
});
