document.addEventListener("DOMContentLoaded",()=>{
    playSound("start.wav")
})
// Select DOM elements
const button = document.querySelector(".play-whack");
const holes = document.querySelector(".whack-holes");
const gameOver = document.querySelector(".whack-game-over");
const settings = document.querySelector("#gear");
const gearMenus = document.querySelector(".gear-menus");
const countDownDisplay = document.querySelector(".countdown");
const scoreCount = document.querySelector(".score-count");
const scoreDisplay = document.querySelector(".whack-score");
const volume = document.querySelector(".whack-volume");

let score = 0;
let timeRemaining = 30;
let gameTimer;
let moleTimer;
let gameActive = false;
let isSound = true;

//utility to toggle volume
volume.addEventListener("click",()=>{
    const volumeIcon = volume.querySelector("i")
    if(volumeIcon.classList.contains("fa-volume-up")){
        volumeIcon.classList.remove("fa-volume-up")
        volumeIcon.classList.add("fa-volume-down")
        isSound = false;
    }else{
        volumeIcon.classList.remove("fa-volume-down")
        volumeIcon.classList.add("fa-volume-up")
        isSound = true;  
    }
})

//utility to play sound
function playSound(audio){
    const sound = new Audio("./sounds/"+audio)
    isSound ? sound.play():''
}

//Utility to get random hole
function getRandomHole() {
    const allHoles = document.querySelectorAll(".hole");
    const index = Math.floor(Math.random() * allHoles.length);
    return allHoles[index];
}

//Function to show mole in a random hole
function showMole() {
    if (!gameActive) return;

    // Remove any previous mole
    document.querySelectorAll(".mole").forEach(m => m.remove());

    const hole = getRandomHole();
    const mole = document.createElement("div");
    mole.classList.add("mole");


    // Add click event to mole
    mole.addEventListener("click", () => {
        //Create and show point popup
        const points = document.createElement("div")
        points.classList.add("whack-points")
        points.textContent = "+100pts"
        mole.appendChild(points)

        playSound("hit.wav")
        score +=100;
        scoreCount.textContent = score;

        // Animate/remove points after 500ms
        setTimeout(() => {
            points.remove();
            mole.remove(); // Remove mole after hit/showing points
        }, 1000);
    });

    hole.appendChild(mole);

    // Mole disappears after 1s
    moleTimer = setTimeout(() => {
        mole.remove();
        // Show another mole
        showMole();
    }, 1000);
}

//Game Timer countdown function
function startTimer() {
    gameTimer = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        countDownDisplay.textContent = formattedTime;

        if(timeRemaining <= 10 && gameActive){
            playSound("warning.wav")
        }
        if (timeRemaining <= 0) {
            clearInterval(gameTimer);
            clearTimeout(moleTimer);
            endGame();
        }

        timeRemaining--;
    }, 1000);
}

//Start the Game
function startGame() {
    playSound("gameon.wav")
    score = 0;
    timeRemaining = 30;
    gameActive = true;
    scoreCount.textContent = score;

    // Show game UI
    document.querySelector(".start-whack").style.display = "none";
    holes.style.display = "grid";
    scoreDisplay.style.display = "block";
    countDownDisplay.style.display = "block";
    gameOver.style.display = "none";

    startTimer();
    showMole();
}

//End the game
function endGame() {
    gameActive = false;
    holes.style.display = "none";
    countDownDisplay.style.display = "none";
    gameOver.style.display = "block";
    gameOver.querySelector("h2").textContent = `${score} PTS`;
}

//Start Button Click Event
button.addEventListener("click", startGame);

//restart game
const continueButton = gameOver.querySelector("button");
continueButton.addEventListener("click", startGame);

//Toggle settings panel
settings.addEventListener("click", () => {
    gearMenus.style.display = gearMenus.style.display === "flex" ? "none" : "flex";
});


