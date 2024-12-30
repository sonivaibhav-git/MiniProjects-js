let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turnO = true;

let count = 0;
const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];
const resetGame = () => {
  turnO = true;
  enableBoxes();
  msgContainer.classList.add("hide");
  count = 0;
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turnO === true) {
      box.innerText = "O";
      box.style.color = "White";
      turnO = false;
      count++;
          

    } else {
      box.innerText = "X";
      box.style.color = "black";
      turnO = true;
      count++;
      
    }
    box.disabled = true;
    checkWinner();
    checkDraw();
  });
});


const checkDraw = () => {
  if (count === 9 && !checkWinner()) 
    //!checkWinner() means if checkWinner() is false
    {
    msg.innerText = "ITS A DRAW !!"
     msgContainer.classList.remove("hide");
  disableBoxes();
}
}
const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.innerText = "";
    box.disabled = false;
  }
};
const showWinner = (winner) => {
  msg.innerText = `Congratulations!!\n The Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};
const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
    }
  }
};
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
