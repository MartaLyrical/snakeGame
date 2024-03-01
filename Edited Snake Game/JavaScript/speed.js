import { mySel, mySelAll } from "./constants.js";
import { startGame } from "./game.js";

mySel(".div").classList.add("d-none");
mySelAll(".sbtn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target.classList.contains("easy")) {
      level = "easy";
      scoreCounterUpto = 5;
      snakeSpeed = 900;
    } else if (e.target.classList.contains("medium")) {
      level = "medium";
      scoreCounterUpto = 7;
      snakeSpeed = 400;
    } else if (e.target.classList.contains("hard")) {
      level = "hard";
      scoreCounterUpto = 10;
      snakeSpeed = 100;
    } else if (e.target.classList.contains("vhard")) {
      level = "vhard";
      scoreCounterUpto = 15;
      snakeSpeed = 40;
    }
    startGame();
  });
});