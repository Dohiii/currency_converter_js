//Selectors
const optionsFrom = document.querySelector("#conver-from");
const optionsTo = document.querySelector("#conver-to");
const amountSelector = document.querySelector("#amount");
const calculate = document.querySelector("#calculate");
const result = document.querySelector(".result");
const reverse = document.querySelector("#reverse");

function populateResult(
  res = 0,
  descrpiption = "you can not convert PLN to PLN"
) {
  result.textContent = `Result is ${res} of ${descrpiption}`;
}

async function fethcNBPData() {
  try {
    const response = await fetch(
      "http://api.nbp.pl/api/exchangerates/tables/c/?format=json"
    );
    if (!response.ok) {
      throw new Error(`Http error: ${response.status}`);
    }

    const data = await response.json();
    const rates = data[0].rates;
    return rates;
  } catch (e) {
    console.log(`Could not get the rates ${e}`);
  }
}

async function populateOptions() {
  fethcNBPData().then((data) => {
    for (let i = 0; i < data.length; i++) {
      const optionFrom = document.createElement("option");
      const optionTo = document.createElement("option");
      optionFrom.value = data[i].code;
      optionFrom.text = data[i].code;
      optionTo.value = data[i].code;
      optionTo.text = data[i].code;
      try {
        optionsFrom.appendChild(optionFrom);
        optionsTo.appendChild(optionTo);
      } catch (e) {
        console.log(e);
      }
    }
    const pln = document.createElement("option");

    pln.value = "PLN";
    pln.text = "PLN";

    optionsTo.add(pln, null);
  });
}

async function countRates() {
  const amount = Number(amountSelector.value);
  const convertFrom = optionsFrom.value;
  const converTo = optionsTo.value;
  amountSelector.value = "";

  fethcNBPData().then((data) => {
    const rates = {};

    for (i = 0; i < data.length; i++) {
      rates[data[i].code] = data[i];
    }

    console.log(rates);

    if (convertFrom === "PLN" && converTo === "PLN") {
      populateResult();
    } else if (convertFrom === "PLN") {
      const rate = rates[converTo].ask;
      const res = amount / rate;
      populateResult(res.toFixed(2), rates[converTo].currency);
    } else if (converTo === "PLN") {
      const zloty = "polish złoty";
      const res = amount * rates[convertFrom].ask;
      populateResult(res.toFixed(2), zloty);
    } else {
      const res = amount / rates[converTo].ask;
      populateResult(res.toFixed(2), rates[converTo].currency);
    }
  });
}

populateOptions();

calculate.addEventListener("click", countRates);

reverse.addEventListener("click", () => {
  const convertFrom = optionsFrom.value;
  const converTo = optionsTo.value;

  optionsFrom.value = converTo;
  optionsTo.value = convertFrom;
});
