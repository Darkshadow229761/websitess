const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");

function showPage(name) {
  pages.forEach(p => p.classList.remove("active"));

  const page = document.getElementById(name);

  if (page) page.classList.add("active");

  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.dataset.page === name
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function goHome() {
  showPage("home");
}

function openGames() {
  showPage("games");
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    showPage(link.dataset.page);
  });
});

function scrollToFeatured() {
  document.getElementById("featured").scrollIntoView({
    behavior: "smooth"
  });
}


/* =========================================
   CINEMATIC PARTICLE BACKGROUND
========================================= */

const spaceCanvas = document.getElementById("spaceCanvas");
const ctxSpace = spaceCanvas.getContext("2d");

let particles = [];
let mouseX = innerWidth / 2;
let mouseY = innerHeight / 2;

function resizeSpace() {
  spaceCanvas.width = innerWidth;
  spaceCanvas.height = innerHeight;
}

window.addEventListener("resize", resizeSpace);
resizeSpace();

for (let i = 0; i < 180; i++) {

  particles.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    size: Math.random() * 1.8 + .2,
    speed: Math.random() * .25 + .05,
    alpha: Math.random() * .7 + .1
  });

}

window.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function particleLoop() {

  ctxSpace.clearRect(
    0,
    0,
    spaceCanvas.width,
    spaceCanvas.height
  );

  const gradient = ctxSpace.createRadialGradient(
    mouseX,
    mouseY,
    0,
    mouseX,
    mouseY,
    450
  );

  gradient.addColorStop(
    0,
    "rgba(0,234,255,.06)"
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctxSpace.fillStyle = gradient;

  ctxSpace.fillRect(
    0,
    0,
    spaceCanvas.width,
    spaceCanvas.height
  );

  particles.forEach(p => {

    p.y += p.speed;

    if (p.y > innerHeight + 5) {
      p.y = -5;
      p.x = Math.random() * innerWidth;
    }

    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let glow = 0;

    if (distance < 250) {
      glow = (1 - distance / 250) * 1.5;
    }

    ctxSpace.beginPath();

    ctxSpace.arc(
      p.x,
      p.y,
      p.size + glow,
      0,
      Math.PI * 2
    );

    ctxSpace.fillStyle =
      `rgba(150,235,255,${p.alpha + glow * .25})`;

    ctxSpace.fill();
  });

  requestAnimationFrame(particleLoop);
}

particleLoop();


/* =========================================
   GAME ENGINE
========================================= */

const gameOverlay = document.getElementById("gameOverlay");
const gameStage = document.getElementById("gameStage");
const gameTitle = document.getElementById("gameTitle");
const gameCategory = document.getElementById("gameCategory");
const scoreElement = document.getElementById("score");

let currentGame = null;
let gameTimer = null;
let animationFrame = null;
let scoreValue = 0;

function setScore(value) {

  scoreValue = value;

  scoreElement.textContent =
    "SCORE " + String(value).padStart(4,"0");
}

function launchGame(game) {

  stopGame();

  currentGame = game;

  gameOverlay.classList.add("show");

  gameStage.innerHTML = "";

  setScore(0);

  const data = {

    snake: [
      "NEON SNAKE",
      "CLASSIC"
    ],

    pong: [
      "NEON PONG",
      "ARCADE"
    ],

    breakout: [
      "BREAKOUT",
      "ARCADE"
    ],

    space: [
      "NEON INVASION",
      "ACTION"
    ],

    click: [
      "CLICK RUSH",
      "REACTION"
    ],

    memory: [
      "MEMORY MATRIX",
      "PUZZLE"
    ]

  };

  gameTitle.textContent = data[game][0];
  gameCategory.textContent = data[game][1];

  if (game === "snake") snakeGame();
  if (game === "pong") pongGame();
  if (game === "breakout") breakoutGame();
  if (game === "space") spaceGame();
  if (game === "click") clickGame();
  if (game === "memory") memoryGame();
}

function closeGame() {

  stopGame();

  gameOverlay.classList.remove("show");
}

function stopGame() {

  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  window.onkeydown = null;
}


/* =========================================
   SNAKE
========================================= */

function snakeGame() {

  const canvas = document.createElement("canvas");

  canvas.width = 700;
  canvas.height = 500;

  canvas.className = "game-canvas";

  gameStage.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  const size = 25;

  let snake = [
    {x:14,y:10},
    {x:13,y:10},
    {x:12,y:10}
  ];

  let direction = {
    x:1,
    y:0
  };

  let nextDirection = {
    x:1,
    y:0
  };

  let food = makeFood();

  function makeFood() {

    return {
      x: Math.floor(Math.random() * 28),
      y: Math.floor(Math.random() * 20)
    };

  }

  window.onkeydown = e => {

    if (e.key === "ArrowUp" && direction.y !== 1)
      nextDirection = {x:0,y:-1};

    if (e.key === "ArrowDown" && direction.y !== -1)
      nextDirection = {x:0,y:1};

    if (e.key === "ArrowLeft" && direction.x !== 1)
      nextDirection = {x:-1,y:0};

    if (e.key === "ArrowRight" && direction.x !== -1)
      nextDirection = {x:1,y:0};

  };

  function update() {

    direction = nextDirection;

    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    const hitWall =
      head.x < 0 ||
      head.x >= 28 ||
      head.y < 0 ||
      head.y >= 20;

    const hitSelf =
      snake.some(
        part =>
          part.x === head.x &&
          part.y === head.y
      );

    if (hitWall || hitSelf) {

      alert("GAME OVER\nScore: " + scoreValue);

      launchGame("snake");

      return;
    }

    snake.unshift(head);

    if (
      head.x === food.x &&
      head.y === food.y
    ) {

      setScore(scoreValue + 10);

      food = makeFood();

    } else {

      snake.pop();

    }

    draw();

  }

  function draw() {

    ctx.fillStyle = "#02030a";
    ctx.fillRect(0,0,700,500);

    ctx.strokeStyle =
      "rgba(0,234,255,.035)";

    for(let x=0;x<700;x+=size) {

      ctx.beginPath();
      ctx.moveTo(x,0);
      ctx.lineTo(x,500);
      ctx.stroke();

    }

    for(let y=0;y<500;y+=size) {

      ctx.beginPath();
      ctx.moveTo(0,y);
      ctx.lineTo(700,y);
      ctx.stroke();

    }

    ctx.shadowBlur = 25;
    ctx.shadowColor = "#ff3c88";
    ctx.fillStyle = "#ff3c88";

    ctx.fillRect(
      food.x * size + 5,
      food.y * size + 5,
      size - 10,
      size - 10
    );

    snake.forEach((part,i) => {

      ctx.shadowColor = "#00eaff";

      ctx.fillStyle =
        i === 0 ? "#ffffff" : "#00eaff";

      ctx.fillRect(
        part.x * size + 3,
        part.y * size + 3,
        size - 6,
        size - 6
      );

    });

    ctx.shadowBlur = 0;

  }

  gameTimer = setInterval(update,100);

  draw();
}


/* =========================================
   PONG
========================================= */

function pongGame() {

  const canvas = document.createElement("canvas");

  canvas.width = 800;
  canvas.height = 500;

  canvas.className = "game-canvas";

  gameStage.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  let player = 200;
  let enemy = 200;

  let ball = {
    x:400,
    y:250,
    dx:5,
    dy:3
  };

  window.onkeydown = e => {

    if(e.key === "ArrowUp")
      player -= 30;

    if(e.key === "ArrowDown")
      player += 30;

    player =
      Math.max(
        0,
        Math.min(
          410,
          player
        )
      );

  };

  function update() {

    ball.x += ball.dx;
    ball.y += ball.dy;

    if(ball.y < 8 || ball.y > 492)
      ball.dy *= -1;

    enemy +=
      (ball.y - (enemy + 45)) * .075;

    if(
      ball.x < 55 &&
      ball.y > player &&
      ball.y < player + 90
    ) {

      ball.dx =
        Math.abs(ball.dx);

      setScore(scoreValue + 1);

    }

    if(
      ball.x > 745 &&
      ball.y > enemy &&
      ball.y < enemy + 90
    ) {

      ball.dx =
        -Math.abs(ball.dx);

    }

    if(ball.x < 0) {

      alert(
        "THE AI WON\nScore: " +
        scoreValue
      );

      launchGame("pong");

      return;
    }

    if(ball.x > 800) {

      setScore(scoreValue + 10);

      ball.x = 400;
      ball.y = 250;
      ball.dx = -5;

    }

    draw();

  }

  function draw() {

    ctx.fillStyle = "#02030a";
    ctx.fillRect(0,0,800,500);

    ctx.setLineDash([10,15]);

    ctx.strokeStyle =
      "rgba(0,234,255,.2)";

    ctx.beginPath();

    ctx.moveTo(400,0);
    ctx.lineTo(400,500);

    ctx.stroke();

    ctx.setLineDash([]);

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00eaff";

    ctx.fillStyle = "#00eaff";

    ctx.fillRect(
      25,
      player,
      12,
      90
    );

    ctx.shadowColor = "#ff3c88";

    ctx.fillStyle = "#ff3c88";

    ctx.fillRect(
      763,
      enemy,
      12,
      90
    );

    ctx.shadowColor = "#ffffff";
    ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.arc(
      ball.x,
      ball.y,
      9,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

  }

  gameTimer = setInterval(update,16);

  draw();
}


/* =========================================
   BREAKOUT
========================================= */

function breakoutGame() {

  const canvas = document.createElement("canvas");

  canvas.width = 800;
  canvas.height = 500;

  canvas.className = "game-canvas";

  gameStage.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  let paddle = 350;

  let ball = {
    x:400,
    y:440,
    dx:4,
    dy:-4
  };

  let bricks = [];

  for(let r=0;r<5;r++) {

    for(let c=0;c<10;c++) {

      bricks.push({

        x:c*78+10,
        y:r*35+40,

        width:68,
        height:23,

        alive:true

      });

    }

  }

  window.onkeydown = e => {

    if(e.key === "ArrowLeft")
      paddle -= 30;

    if(e.key === "ArrowRight")
      paddle += 30;

    paddle =
      Math.max(
        0,
        Math.min(
          700,
          paddle
        )
      );

  };

  function update() {

    ball.x += ball.dx;
    ball.y += ball.dy;

    if(
      ball.x < 8 ||
      ball.x > 792
    )
      ball.dx *= -1;

    if(ball.y < 8)
      ball.dy *= -1;

    if(
      ball.y > 440 &&
      ball.x > paddle &&
      ball.x < paddle + 100
    ) {

      ball.dy =
        -Math.abs(ball.dy);

    }

    bricks.forEach((brick,index) => {

      if(!brick.alive)
        return;

      if(
        ball.x > brick.x &&
        ball.x < brick.x + brick.width &&
        ball.y > brick.y &&
        ball.y < brick.y + brick.height
      ) {

        brick.alive = false;

        ball.dy *= -1;

        setScore(
          scoreValue + 10
        );

      }

    });

    if(
      bricks.every(
        b => !b.alive
      )
    ) {

      alert(
        "LEVEL COMPLETE!\nScore: " +
        scoreValue
      );

      launchGame("breakout");

      return;

    }

    if(ball.y > 510) {

      alert(
        "GAME OVER\nScore: " +
        scoreValue
      );

      launchGame("breakout");

      return;

    }

    draw();

  }

  function draw() {

    ctx.fillStyle = "#02030a";

    ctx.fillRect(
      0,
      0,
      800,
      500
    );

    bricks.forEach((brick,index) => {

      if(!brick.alive)
        return;

      ctx.fillStyle =
        index % 2 === 0
          ? "#00eaff"
          : "#7657ff";

      ctx.shadowBlur = 10;

      ctx.shadowColor =
        ctx.fillStyle;

      ctx.fillRect(
        brick.x,
        brick.y,
        brick.width,
        brick.height
      );

    });

    ctx.shadowColor = "#00eaff";
    ctx.fillStyle = "#00eaff";

    ctx.fillRect(
      paddle,
      470,
      100,
      12
    );

    ctx.shadowColor = "white";
    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
      ball.x,
      ball.y,
      8,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

  }

  gameTimer =
    setInterval(
      update,
      16
    );

  draw();
}


/* =========================================
   SPACE SHOOTER
========================================= */

function spaceGame() {

  const canvas =
    document.createElement("canvas");

  canvas.width = 800;
  canvas.height = 500;

  canvas.className =
    "game-canvas";

  gameStage.appendChild(canvas);

  const ctx =
    canvas.getContext("2d");

  let player = {
    x:400,
    y:440
  };

  let bullets = [];
  let enemies = [];

  let keys = {};

  let spawn = 0;

  window.onkeydown = e => {

    keys[e.key] = true;

    if(e.code === "Space") {

      bullets.push({

        x:player.x,
        y:player.y - 20

      });

    }

  };

  window.onkeyup = e => {

    keys[e.key] = false;

  };

  function update() {

    if(keys["ArrowLeft"])
      player.x -= 7;

    if(keys["ArrowRight"])
      player.x += 7;

    player.x =
      Math.max(
        20,
        Math.min(
          780,
          player.x
        )
      );

    bullets.forEach(
      b => b.y -= 10
    );

    bullets =
      bullets.filter(
        b => b.y > -20
      );

    spawn++;

    if(spawn > 35) {

      enemies.push({

        x:Math.random()*760+20,
        y:-20,
        speed:
          1.5 +
          Math.random()*2

      });

      spawn = 0;

    }

    enemies.forEach(
      e => e.y += e.speed
    );

    for(
      let ei=enemies.length-1;
      ei>=0;
      ei--
    ) {

      const enemy =
        enemies[ei];

      for(
        let bi=bullets.length-1;
        bi>=0;
        bi--
      ) {

        const bullet =
          bullets[bi];

        if(
          Math.abs(
            enemy.x -
            bullet.x
          ) < 20 &&
          Math.abs(
            enemy.y -
            bullet.y
          ) < 20
        ) {

          enemies.splice(
            ei,
            1
          );

          bullets.splice(
            bi,
            1
          );

          setScore(
            scoreValue + 10
          );

          break;

        }

      }

      if(
        enemy &&
        Math.abs(
          enemy.x -
          player.x
        ) < 25 &&
        Math.abs(
          enemy.y -
          player.y
        ) < 30
      ) {

        alert(
          "SHIP DESTROYED\nScore: " +
          scoreValue
        );

        launchGame("space");

        return;

      }

    }

    draw();

  }

  function draw() {

    ctx.fillStyle =
      "#02030a";

    ctx.fillRect(
      0,
      0,
      800,
      500
    );

    for(
      let i=0;
      i<80;
      i++
    ) {

      const x =
        (i * 137) % 800;

      const y =
        (i * 71 +
        Date.now()/18) % 500;

      ctx.fillStyle =
        "rgba(150,240,255,.5)";

      ctx.fillRect(
        x,
        y,
        2,
        2
      );

    }

    ctx.shadowBlur = 25;
    ctx.shadowColor =
      "#00eaff";

    ctx.fillStyle =
      "#00eaff";

    ctx.beginPath();

    ctx.moveTo(
      player.x,
      player.y - 22
    );

    ctx.lineTo(
      player.x - 20,
      player.y + 20
    );

    ctx.lineTo(
      player.x,
      player.y + 10
    );

    ctx.lineTo(
      player.x + 20,
      player.y + 20
    );

    ctx.closePath();

    ctx.fill();

    bullets.forEach(
      b => {

        ctx.fillStyle =
          "white";

        ctx.fillRect(
          b.x - 2,
          b.y,
          4,
          15
        );

      }
    );

    enemies.forEach(
      e => {

        ctx.shadowColor =
          "#ff3c88";

        ctx.fillStyle =
          "#ff3c88";

        ctx.beginPath();

        ctx.arc(
          e.x,
          e.y,
          15,
          0,
          Math.PI * 2
        );

        ctx.fill();

      }
    );

    ctx.shadowBlur = 0;

  }

  gameTimer =
    setInterval(
      update,
      16
    );

  draw();
}


/* =========================================
   CLICK RUSH
========================================= */

function clickGame() {

  const box =
    document.createElement("div");

  box.style.textAlign =
    "center";

  box.style.width =
    "100%";

  box.innerHTML = `

    <div style="
      color:#00eaff;
      font-size:10px;
      letter-spacing:4px;
      margin-bottom:15px
    ">
      REACTION TEST
    </div>

    <h1 style="
      font-size:55px;
      margin:0
    ">
      CLICK RUSH
    </h1>

    <p style="
      color:#858ca5;
      margin:15px 0 35px
    ">
      Destroy the target before time runs out.
    </p>

    <div id="clickTime"
      style="
        font-size:20px;
        color:#00eaff;
        margin-bottom:20px
      ">
      10
    </div>

    <button id="clickTarget"
      style="
        width:190px;
        height:190px;
        border-radius:50%;
        border:1px solid #00eaff;
        background:
        radial-gradient(
          circle,
          white,
          #00eaff 15%,
          #073a43 40%,
          #02030a 70%
        );
        color:white;
        font-size:22px;
        font-weight:bold;
        box-shadow:
        0 0 30px #00eaff,
        0 0 100px rgba(0,234,255,.25);
      "
    >
      CLICK
    </button>

  `;

  gameStage.appendChild(box);

  let time = 10;

  document.getElementById(
    "clickTarget"
  ).onclick = () => {

    if(time <= 0)
      return;

    setScore(
      scoreValue + 1
    );

  };

  gameTimer =
    setInterval(() => {

      time--;

      document.getElementById(
        "clickTime"
      ).textContent =
        time;

      if(time <= 0) {

        clearInterval(
          gameTimer
        );

        document.getElementById(
          "clickTarget"
        ).disabled = true;

        document.getElementById(
          "clickTime"
        ).textContent =
          "FINAL SCORE: " +
          scoreValue;

      }

    },1000);

}


/* =========================================
   MEMORY
========================================= */

function memoryGame() {

  const board =
    document.createElement("div");

  board.style.display =
    "grid";

  board.style.gridTemplateColumns =
    "repeat(4,90px)";

  board.style.gap =
    "12px";

  const symbols = [
    "🚀","🚀",
    "⚡","⚡",
    "👾","👾",
    "🔥","🔥",
    "💎","💎",
    "⭐","⭐",
    "🌙","🌙",
    "🎮","🎮"
  ];

  symbols.sort(
    () => Math.random() - .5
  );

  let first = null;
  let locked = false;
  let matched = 0;

  symbols.forEach(
    symbol => {

      const card =
        document.createElement("button");

      card.textContent = "?";

      card.style.width =
        "90px";

      card.style.height =
        "90px";

      card.style.fontSize =
        "30px";

      card.style.background =
        "#090d19";

      card.style.color =
        "white";

      card.style.border =
        "1px solid rgba(0,234,255,.2)";

      card.style.borderRadius =
        "8px";

      card.onclick = () => {

        if(
          locked ||
          card.dataset.done
        )
          return;

        card.textContent =
          symbol;

        if(!first) {

          first = {
            card,
            symbol
          };

          return;

        }

        if(
          first.symbol === symbol
        ) {

          first.card.dataset.done =
            "true";

          card.dataset.done =
            "true";

          matched++;

          setScore(
            scoreValue + 10
          );

          first = null;

          if(matched === 8) {

            setTimeout(() => {

              alert(
                "MATRIX CLEARED!\nScore: " +
                scoreValue
              );

            },200);

          }

        } else {

          locked = true;

          setTimeout(() => {

            card.textContent =
              "?";

            first.card.textContent =
              "?";

            first = null;
            locked = false;

          },700);

        }

      };

      board.appendChild(card);

    }
  );

  gameStage.appendChild(board);

}


/* =========================================
   SEARCH
========================================= */

document.getElementById(
  "search"
).addEventListener(
  "input",
  e => {

    const query =
      e.target.value.toLowerCase();

    document.querySelectorAll(
      ".game-tile"
    ).forEach(tile => {

      tile.style.display =
        tile.dataset.name
          .toLowerCase()
          .includes(query)
          ? ""
          : "none";

    });

  }
);


/* =========================================
   AUTH UI
========================================= */

function openAuth() {

  document.getElementById(
    "auth"
  ).classList.add("show");

}

function closeAuth() {

  document.getElementById(
    "auth"
  ).classList.remove("show");

}

function authMode(mode) {

  const login =
    mode === "login";

  document.getElementById(
    "loginBox"
  ).classList.toggle(
    "hidden",
    !login
  );

  document.getElementById(
    "signupBox"
  ).classList.toggle(
    "hidden",
    login
  );

  document.querySelectorAll(
    ".auth-tab"
  ).forEach(
    (tab,index) => {

      tab.classList.toggle(
        "active",
        login
          ? index === 0
          : index === 1
      );

    }
  );

}

function signup() {

  const name =
    document.getElementById(
      "signupName"
    ).value.trim();

  const email =
    document.getElementById(
      "signupEmail"
    ).value.trim();

  const password =
    document.getElementById(
      "signupPassword"
    ).value;

  const message =
    document.getElementById(
      "authMessage"
    );

  if(
    !name ||
    !email ||
    !password
  ) {

    message.textContent =
      "Complete every field.";

    return;

  }

  if(password.length < 6) {

    message.textContent =
      "Password must be at least 6 characters.";

    return;

  }

  localStorage.setItem(
    "nexus_user",
    JSON.stringify({
      name,
      email
    })
  );

  message.textContent =
    "Account created locally. Secure email verification requires a backend.";

}

function login() {

  const email =
    document.getElementById(
      "loginEmail"
    ).value.trim();

  const message =
    document.getElementById(
      "authMessage"
    );

  const user =
    JSON.parse(
      localStorage.getItem(
        "nexus_user"
      )
    );

  if(
    user &&
    user.email === email
  ) {

    message.textContent =
      "Welcome back, " +
      user.name +
      ".";

  } else {

    message.textContent =
      "Account not found on this browser.";

  }

}


/* =========================================
   INITIAL STATE
========================================= */

showPage("home");
