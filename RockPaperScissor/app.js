let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll('.choice');
const msg = document.querySelector('#msg')
const userPoints = document.querySelector('#user-score');
const compPoints = document.querySelector('#comp-score');

const genCompChoice = ()=>{
    const Options = ["rock", "paper", "scissor"];
   const randIdx = Math.floor(Math.random()*3);
    return Options[randIdx];
}
const showWinner = (userWin)=>{
    if(userWin){
        userScore++;
        userPoints.innerText = userScore;
        msg.innerText = "You Win 🥳"
         msg.style.backgroundColor ="#BCEDF6";
        msg.style.border = "10px solid #5EFC8D"
    }else{
        compScore++;
        compPoints.innerText = compScore;
        msg.innerText = "You Lose 😔 "
        msg.style.backgroundColor = "red"
        msg.style.border = "10px solid red"
    }
}

const draw=()=>{
    msg.innerText = "Its a Tie 😁"
  
    
}

const playGame = (userChoice)=>{
 const compChoice = genCompChoice();

    if (userChoice === compChoice){
    draw();
    }else{
        let userWin;
        if (userChoice === "rock"){
            // scissor, paper
            compChoice === "paper" ? userWin = false: userWin =true;
        }else if(userChoice === "paper"){
          compChoice === "scissor"? userWin = false : userWin = true;
        }else {
           compChoice === "rock"? userWin = false:userWin = true;
        }
        showWinner(userWin);
    }
}


choices.forEach((choice)=>{
  
    choice.addEventListener("click",()=>{
        const userChoice = choice.getAttribute("id");
       playGame(userChoice)
    });
});

