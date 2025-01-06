const BASE_URL =  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies"
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button")

let fromCurr = document.querySelector(".from select")
let toCurr = document.querySelector(".to select")

for (let select of dropdowns){
    for (currCode in countryList){
        let newOption = document.createElement("option");
            newOption.innerText = currCode;
            newOption.value = currCode;
            if (select.name === "from" && currCode ==="USD" ){
                newOption.selected="selected";
            }else if (select.name === "to" && currCode ==="INR" ){
                newOption.selected="selected";
            }
            select.append(newOption);
    }

    select.addEventListener("change", (evt)=> {
        updateFlag(evt.target)//called update flag function
    })
}


// to update the flags
const updateFlag=(element)=>{
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

btn.addEventListener('click', async(evt)=>{
 evt.preventDefault();
 let amount = document.querySelector(".amount input")
 let amountVal = amount.value;
 if (amountVal === "" || amountVal <= 1){
    amountVal= 1;
    amount.value="1";
 } 
 const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()} //${toCurr.value.toLowerCase()}.json`;
let response = await fetch(URL);
console.log(response);
})

