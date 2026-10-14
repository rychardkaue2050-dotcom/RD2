const player = document.getElementById("player");

const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");
const livesText = document.getElementById("lives");
const playerNameText = document.getElementById("playerName");

const gameOverScreen = document.getElementById("gameOver");

const finalScore = document.getElementById("finalScore");
const finalCoins = document.getElementById("finalCoins");

let jogadorAtual = null;



let gameRunning = true;

let jumping = false;

let score = 0;

let coins = 0;

let lives = 3;

let speed = 6;
let sceneOffset = 0;

const parallaxElements = document.querySelectorAll(".cloud, .mountain, .tree");

parallaxElements.forEach((element) => {
    let factor = 0.4;

    if (element.classList.contains("cloud")) {
        factor = 0.6;
    } else if (element.classList.contains("mountain")) {
        factor = 0.25;
    } else if (element.classList.contains("tree")) {
        factor = 0.8;
    }

    element.dataset.parallax = String(factor);
});

function updateParallax() {
    if (!gameRunning) {
        return;
    }

    sceneOffset = (sceneOffset + speed * 0.7) % 2000;

    parallaxElements.forEach((element) => {
        const factor = Number(element.dataset.parallax || 0.4);
        element.style.setProperty("--scene-shift", `${-(sceneOffset * factor)}px`);
    });
}

function carregarJogadorAtual() {
    try {
        jogadorAtual = JSON.parse(localStorage.getItem("jogadorAtual"));
    } catch (error) {
        jogadorAtual = null;
    }

    if (jogadorAtual) {
        const nomeJogador = jogadorAtual.nickname || jogadorAtual.nome || "Jogador";
        playerNameText.textContent = "🎮 Jogador: " + nomeJogador;
    } else {
        playerNameText.textContent = "🎮 Jogador: visitante";
    }
}

function salvarProgressoJogador() {
    if (!jogadorAtual) {
        return;
    }

    const jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
    const nivelAtual = Math.max(1, Math.floor(score / 100) + 1);

    jogadorAtual = {
        ...jogadorAtual,
        pontos: score,
        nivel: nivelAtual
    };

    const index = jogadores.findIndex(function(jogador) {
        return Number(jogador.id) === Number(jogadorAtual.id);
    });

    if (index !== -1) {
        jogadores[index] = {
            ...jogadores[index],
            ...jogadorAtual
        };
    } else {
        jogadores.push(jogadorAtual);
    }

    localStorage.setItem("jogadores", JSON.stringify(jogadores));
    localStorage.setItem("jogadorAtual", JSON.stringify(jogadorAtual));
}

function returnToCrud() {
    window.location.href = "index.html";
}




document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {

        event.preventDefault();

        jump();

    }

});


document.addEventListener("click", function() {

    jump();

});


function jump() {

    if (jumping || !gameRunning) {
        return;
    }

    jumping = true;

    let height = 0;

    let direction = 1;


    const jumpInterval = setInterval(() => {

        height += 10 * direction;

        player.style.bottom =
            (100 + height) + "px";



        if (height >= 170) {

            direction = -1;

        }



        if (height <= 0) {

            clearInterval(jumpInterval);

            player.style.bottom = "100px";

            jumping = false;

        }

    }, 20);

}



function createObstacle() {

    if (!gameRunning) {
        return;
    }


    const obstacle =
        document.createElement("div");


    obstacle.classList.add("obstacle");



    const types = [
        "rock",
        "box",
        "cactus"
    ];


    const randomType =
        types[
            Math.floor(
                Math.random() * types.length
            )
        ];


    obstacle.classList.add(randomType);



    obstacle.style.right = "-100px";


    document
        .getElementById("game")
        .appendChild(obstacle);


    let position = -100;


    const movement =
        setInterval(() => {

            if (!gameRunning) {

                clearInterval(movement);

                return;

            }



            position += speed;


            obstacle.style.right =
                position + "px";


            checkCollision(obstacle);


    

            if (
                position >
                window.innerWidth + 100
            ) {

                clearInterval(movement);

                obstacle.remove();

            }

        }, 20);

}



function createCoin() {

    if (!gameRunning) {
        return;
    }


    const coin =
        document.createElement("div");


    coin.classList.add("coin");


    coin.style.right = "-50px";


    document
        .getElementById("game")
        .appendChild(coin);


    let position = -50;


    const movement =
        setInterval(() => {

            if (!gameRunning) {

                clearInterval(movement);

                return;

            }


            position += speed;


            coin.style.right =
                position + "px";


            checkCoinCollision(coin);


            if (
                position >
                window.innerWidth + 100
            ) {

                clearInterval(movement);

                coin.remove();

            }

        }, 20);

}




function checkCollision(obstacle) {

    const playerRect =
        player.getBoundingClientRect();


    const obstacleRect =
        obstacle.getBoundingClientRect();


    if (

        playerRect.left <
        obstacleRect.right &&

        playerRect.right >
        obstacleRect.left &&

        playerRect.top <
        obstacleRect.bottom &&

        playerRect.bottom >
        obstacleRect.top

    ) {

        obstacle.remove();

        loseLife();

    }

}




function checkCoinCollision(coin) {

    const playerRect =
        player.getBoundingClientRect();


    const coinRect =
        coin.getBoundingClientRect();


    if (

        playerRect.left <
        coinRect.right &&

        playerRect.right >
        coinRect.left &&

        playerRect.top <
        coinRect.bottom &&

        playerRect.bottom >
        coinRect.top

    ) {

        coins++;


        coinsText.textContent =
            "🪙 " + coins;


        coin.remove();

    }

}




function loseLife() {

    lives--;


    updateLives();


    

    player.style.opacity = "0.3";


    setTimeout(() => {

        player.style.opacity = "1";

    }, 300);


    if (lives <= 0) {

        gameOver();

    }

}




function updateLives() {

    livesText.textContent =
        "❤️".repeat(lives);

}




function gameOver() {

    gameRunning = false;


    finalScore.textContent =
        score;


    finalCoins.textContent =
        coins;

    salvarProgressoJogador();

    gameOverScreen.style.display =
        "flex";
}




function restartGame() {

    location.reload();

}



setInterval(() => {

    if (!gameRunning) {
        return;
    }


    score++;


    scoreText.textContent =
        "🏆 Pontos: " + score;



    if (score % 100 === 0) {

        speed += 1;

    }

}, 100);




function obstacleLoop() {

    if (!gameRunning) {
        return;
    }


    createObstacle();


    const time =
        Math.random() * 1300 + 900;


    setTimeout(
        obstacleLoop,
        time
    );

}




function coinLoop() {

    if (!gameRunning) {
        return;
    }


    createCoin();


    const time =
        Math.random() * 1800 + 1200;


    setTimeout(
        coinLoop,
        time
    );

}




function createSpeedLine() {

    if (!gameRunning) {
        return;
    }


    const line =
        document.createElement("div");


    line.classList.add("speedLine");



    line.style.top =
        Math.random() * 60 + 20 + "%";


    document
        .getElementById("game")
        .appendChild(line);


    setTimeout(() => {

        line.remove();

    }, 1000);

}




setInterval(() => {

    if (gameRunning) {

        createSpeedLine();

    }

}, 500);

setInterval(() => {
    updateParallax();
}, 30);


carregarJogadorAtual();
obstacleLoop();

coinLoop();

