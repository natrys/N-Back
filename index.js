const instruction = `
Keyboard:<br>
n/s - start/stop;<br>
j/k - position/color;
`

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class Config {
    constructor() {
        this.level = 2;
        this.iteration = 20;
        this.penalty = 1;
    }
}

class Game {
    constructor() {
        this.default_color = "gray";
        this.color_list = [
            "DarkOrchid", "MintCream", "DarkGreen", "LawnGreen",
            "Black", "PowderBlue", "RoyalBlue", "Chocolate"
        ];
    }

    clean_slate() {
        this.progress = false;
        this.square = 1;
        this.level = 2;
        this.iteration = 20;
        this.tick = 0;
        this.history = [];
        this.penalty = 1;
        this.square_guess = -1;
        this.color_guess = -1;
        this.score = 0;
        this.total = 0;
    }

    score_update() {
        // console.log(this.square_guess, this.color_guess);
        
        if (this.tick <= this.level) {
            return;
        }

        let index = this.tick - this.level - 1;
        let [square_answer, color_answer] = this.history[index];

        if (this.square_guess > -1) {
            this.score +=
                (square_answer === this.square_guess) ? 1 : -this.penalty;
        }

        if (this.color_guess > -1) {
            this.score += (color_answer === this.color_guess) ? 1 : -this.penalty;
        }        

        if (color_answer === this.color) { this.total++ };
        if (square_answer === this.square) { this.total++ };
        
        // console.log(`Current Score: ${game.score} / ${game.total}`);
    }
        
    update() {
        this.square_guess = -1;
        this.color_guess = -1;
        this.square = getRandomInt(9) + 1;
        this.color = getRandomInt(this.color_list.length);
        this.history.push([this.square, this.color]);
    }
}

var game = new Game();
var config = new Config();

function render() {
    // console.log(game.history);
    document.getElementById("Pos").classList.remove("active");
    document.getElementById("Col").classList.remove("active");
    let message = `Round: ${game.tick} / ${game.iteration}`
    document.getElementById("modeline").textContent = message;
    let square = document.getElementById(`box${game.square}`);
    square.style.background = game.color_list[game.color];
    window.setTimeout(() => {
        square.style.background = game.default_color;
    }, 1000);
}

function importConfig() {
    config.level = Number(document.getElementById("level-slider").value);
    config.penalty = Number(document.getElementById("penalty").value);
    game.level = config.level;
    game.iteration = config.iteration;
    game.penalty = config.penalty;
}

function gameBegin() {
    reset_UI();    
    game.clean_slate();
    importConfig();
    game.progress = true;
    document.getElementsByTagName("button")[0].disabled = true;
}

function gameEnd() {
    window.clearTimeout(game.timer);
    reset_UI();
    game.progress = false;
}

function reset_UI() {
    document.getElementById("Pos").classList.remove("active");
    document.getElementById("Col").classList.remove("active");
    document.getElementById("modeline").innerHTML = instruction;
    document.getElementsByTagName("button")[0].disabled = false;
}

function show_score() {
    let score = Math.max(game.score, 0);
    let total = game.total;
    let percent = Math.round(score * 100 / total);
    let message = `Score: ${score} / ${total} (${percent}%)`
    document.getElementById("modeline").textContent = message;
}

function gameLoop() {
    if (game.progress) { return };
    gameBegin();
    let counter = 0;
    let _timer_ = () => {
        if (game.tick < game.iteration) {
            if (game.tick > 0) { game.score_update() };
            game.update();
            game.tick++;            
            render();
            game.timer = window.setTimeout(_timer_, 2000);
        } else {
            game.score_update();
            gameEnd();
            show_score();
        }
    }
    _timer_();
}

window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
        return
    }
    switch (event.key) {
    case "n":
        gameLoop();
        break;
    case "Enter":
        gameLoop();
        break;
    case "s":
        gameEnd();
        break;
    case "j":
        game.square_guess = game.square;
        document.getElementById("Pos").classList.add("active");
        break;
    case "k":
        game.color_guess = game.color;
        document.getElementById("Col").classList.add("active");
    default:
        return;
    }
})

window.addEventListener("load", (event) => {
    document.getElementsByTagName("button")[0].onclick = () => {
        gameLoop();
    }

    document.getElementById("Pos").onclick = () => {
        game.square_guess = game.square;
    };

    document.getElementById("Col").onclick = () => {
        game.color_guess = game.color;
    };

    document.getElementById("toggle").onclick = () => {
        document.getElementsByClassName("sidebar")[0].classList.toggle("open");
    };

    document.getElementById("modeline").innerHTML = instruction;

    document.getElementById("square").onclick = () => {
        if (!game.progress) {
            gameLoop();
        } else {
            gameEnd();
        };
    };

    let level_slider = document.getElementById("level-slider");
    let level_show = document.getElementById("level-show");
    level_show.innerHTML = `Level: ${level_slider.value}`;

    level_slider.oninput = () => {
        level_show.innerHTML = `Level: ${level_slider.value}`;
    };

});
