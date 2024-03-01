import { mySel, numOfRow, numOfBlocks } from "./constants.js";
import { level } from "./levels.js";
import { randomRow } from "./utils.js";

let scoreCounterUpto = 1;
let snakeSpeed;
let score = 0;
let snake = [];
let foodX = 0;
let foodY = 0;
let curKey = "";


export function startGame() {
    //hide level block and show snake box
    mySel(".div").classList.remove("d-none");
    mySel(".body").classList.add("d-none");
  
    scoreCounterUpto = setDifficulty(); // Set difficulty based on level selection
    initGameArea(); // Initialize game area
    initSnake(); // Initialize snake
    initListeners(); // Initialize keyboard and mobile button listeners
    checkMove(snake, snakeSpeed, down, right, up, left, changeDirection, checkOverride); // Call the keyboard function
    gameLoop(); // Start game loop
}

function setDifficulty() {
    let speed;
    switch (level) {
      case "easy":
        speed = 900;
        break;
      case "medium":
        speed = 400;
        break;
      case "hard":
        speed = 100;
        break;
      case "vhard":
        speed = 40;
        break;
      default:
        speed = 900;
    }
    snakeSpeed = speed;
    return [5, 7, 10, 15][["easy", "medium", "hard", "vhard"].indexOf(level)];
}

function initGameArea() {
    mySel(".score").innerText += score;
  
    let newBlocks = "<table>";
    for (let i = 0; i < Math.sqrt(numOfBlocks); i++) {
      newBlocks += `<tr>`;
      for (let j = 0; j < Math.sqrt(numOfBlocks); j++) {
        newBlocks += `<td class="r${i} c${j} "></td>`;
      }
      newBlocks += `</tr>`;
    }
    newBlocks += `</table>`;
  
    const container = mySel(".container");
    container.innerHTML = newBlocks;
  
    // Disable tab key
    document.onkeydown = function (t) {
      if (t.which == 9) return false;
    };
  
    const width = document.body.clientWidth;
    if (width > 576) {
      // On click focus
      document.onclick = function (e) {
        mySel("#txt").focus();
      };
    }
}

function initSnake() {
    snake = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ];
}

function initListeners() {
    document.addEventListener("keydown", (e) => {
      curKey = e.key;
    });
  
    mySelAll(".arrowBtns").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("left")) {
          curKey = "ArrowLeft";
        } else if (btn.classList.contains("right")) {
          curKey = "ArrowRight";
        } else if (btn.classList.contains("up")) {
          curKey = "ArrowUp";
        } else if (btn.classList.contains("down")) {
          curKey = "ArrowDown";
        }
      });
    });
}



function gameLoop() {
  const changeMove = setInterval(() => {
      let move = curKey || "ArrowRight"; // Get current move

      //last
      let row = snake[snake.length - 1][0];
      let col = snake[snake.length - 1][1];

      //insert unique last pressed keys
      if (lastMoves[lastMoves.length - 1] != move) {
          lastMoves.push(move);
      }

      // lastMoves[lastMoves.length-2] != "ArrowUp" This is block the unidirectoin move
      if (move == "ArrowDown" && lastMoves[lastMoves.length - 2] != "ArrowUp") {
          down(row);
      }
      if (move == "ArrowRight" && lastMoves[lastMoves.length - 2] != "ArrowLeft") {
          right(col);
      }
      if (move == "ArrowUp" && lastMoves[lastMoves.length - 2] != "ArrowDown") {
          up(row);
      }
      if (move == "ArrowLeft" && lastMoves[lastMoves.length - 2] != "ArrowRight") {
          left(col);
      }

      changeDirection();
      checkOverride();
  }, snakeSpeed);
}

//movement function
function up(row) {
  snake[snake.length - 1][0] = row;
  snake.push([snake[snake.length - 1][0] - 1, snake[snake.length - 1][1]]);
  snake.shift();
}

function down(row) {
  snake[snake.length - 1][0] = row;
  snake.push([snake[snake.length - 1][0] + 1, snake[snake.length - 1][1]]);
  snake.shift();
}

function right(col) {
  snake[snake.length - 1][1] = col;
  snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1] + 1]);
  snake.shift();
}

function left(col) {
  snake[snake.length - 1][1] = col;
  snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1] - 1]);
  snake.shift();
}


// Change the direction function
function changeDirection() {
  removeAllEfect();
  snake.forEach((cur, index) => {
    // If the snake eats food
    if (snake[snake.length - 1][0] == foodX && snake[snake.length - 1][1] == foodY) {
      // Score module
      if (scoreCounter == scoreCounterUpto && score != 0) {
        score = score + 5;
        mySel(".sc").innerHTML = `<h1 class="effect">+ 5</h1>`;
        setTimeout(() => {
          mySel(".sc").innerHTML = ``;
        }, 1200);
        scoreCounter = 1;
      } else {
        ++scoreCounter;
        ++score;
      }
      // Show score
      mySel(".score").innerText = score;
      // Remove old food
      mySel("table").children[0].children[parseInt(foodX)].children[parseInt(foodY)].classList.remove("food");
      snake.push([foodX, foodY]);
      food();
    }

    // Game over conditions
    if (
      snake[snake.length - 1][0] == numOfRow ||
      snake[snake.length - 1][1] == numOfRow ||
      snake[snake.length - 1][0] == -1 ||
      snake[snake.length - 1][1] == -1
    ) {
      gameOver();
    }

    mySel("table").children[0].children[cur[0]].children[cur[1]].classList.add("active");
  });
}

function removeAllEfect() {
let allTd = mySelAll("td");
allTd.forEach((td) => {
    td.classList.remove("active");
});
}

//generate random food function
function food() {
  foodX = randomRow();
  foodY = randomRow();

  //add food at random place
  mySel("table").children[0].children[parseInt(foodX)].children[
    parseInt(foodY)
  ].classList.add("food");
}


function gameOver() {
    let ii = 0;
    clearInterval(changeMove);
    if (
      (parseInt(localStorage.getItem("snakeEasy")) < score ||
        !localStorage.getItem("snakeEasy")) &&
      level == "easy"
    ) {
      localStorage.setItem("snakeEasy", score);
      alert("Game over!!\n\n congrats\n You did new high score :) ");
      ii++;
    }
    if (
      (parseInt(localStorage.getItem("snakeMedium")) < score ||
        !localStorage.getItem("snakeMedium")) &&
      level == "medium"
    ) {
      localStorage.setItem("snakeMedium", score);
      ii++;
      alert("Game over!!\n\n congrats\n You did new high score :) ");
    }
    if (
      (parseInt(localStorage.getItem("snakeHard")) < score ||
        !localStorage.getItem("snakeHard")) &&
      level == "hard"
    ) {
      localStorage.setItem("snakeHard", score);
      ii++;
      alert("Game over!!\n\n congrats\n You did new high score :) ");
    }
    if (
      (parseInt(localStorage.getItem("snakeVHard")) < score ||
        !localStorage.getItem("snakeVHard")) &&
      level == "vhard"
    ) {
      localStorage.setItem("snakeVHard", score);
      ii++;
      alert("Game over!!\n\n congrats\n You did new high score :) ");
    }

    if (ii == 0) {
      alert("Game over !!\n\n This is not easy as you imagine :( ");
      // window.location.reload()
    }
}

//fix override snake function
function checkOverride() {
  for (let i = 0; i < snake.length - 2; i++) {
    if (
      snake[i][0] == snake[snake.length - 1][0] &&
      snake[i][1] == snake[snake.length - 1][1]
    ) {
      gameOver();
      i = snake.length - 2;
    }
  }
}