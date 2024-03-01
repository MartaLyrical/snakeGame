import { mySel } from "./constants.js";

// Export the level variable
export let level = "";

// Levels
if (!localStorage.getItem("snakeEasy")) {
mySel(".high1").innerText = "0";
} else {
mySel(".high1").innerText = localStorage.getItem("snakeEasy");
}
if (!localStorage.getItem("snakeMedium")) {
mySel(".high2").innerText = "0";
} else {
mySel(".high2").innerText = localStorage.getItem("snakeMedium");
}
if (!localStorage.getItem("snakeHard")) {
mySel(".high3").innerText = "0";
} else {
mySel(".high3").innerText = localStorage.getItem("snakeHard");
}
if (!localStorage.getItem("snakeVHard")) {
mySel(".high4").innerText = "0";
} else {
mySel(".high4").innerText = localStorage.getItem("snakeVHard");
}