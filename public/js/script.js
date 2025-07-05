import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { io } from 'socket.io-client';

let scene, camera, renderer, paddle1, paddle2, ball, scorePlayer1, scorePlayer2, controls;
let ballSpeed = { x: 0, y: 0, z: 0 };
let ballInPlay = false;
let servingPlayer = 1;
let points = ["0", "15", "30", "40", "Game"];
let games = [0, 0];
let socket, playerNumber;
let gameMode = 'singleplayer';

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    const fieldGeometry = new THREE.PlaneGeometry(20, 10);
    const fieldTexture = new THREE.TextureLoader().load('images/tennis_court.jpg');
    const fieldMaterial = new THREE.MeshPhongMaterial({ map: fieldTexture });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    scene.add(field);

    addBoundary(-10, 0, 0.1, 10, 0.5);
    addBoundary(10, 0, 0.1, 10, 0.5);
    addBoundary(0, 5, 20, 0.1, 0.5);
    addBoundary(0, -5, 20, 0.1, 0.5);

    // Correggere la rete
    const netGeometry = new THREE.PlaneGeometry(10, 0.6);
    const netTexture = new THREE.TextureLoader().load('images/tennis_net_texture.jpg');
    const netMaterial = new THREE.MeshPhongMaterial({ map: netTexture, side: THREE.DoubleSide, transparent: true });
    const net = new THREE.Mesh(netGeometry, netMaterial);
    net.position.set(0, 0.3, 0);
    net.rotation.x = -Math.PI / 2; // Orientamento corretto della rete
    net.rotation.z = Math.PI / 2; // Ruota la rete orizzontalmente
    scene.add(net);

    const paddleGeometry = new THREE.BoxGeometry(0.2, 1.2, 1.5);
    const paddleMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle1.position.set(-9, 0.6, 0);
    paddle2.position.set(9, 0.6, 0);
    scene.add(paddle1);
    scene.add(paddle2);

    const ballGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    resetBall();
    scene.add(ball);

    scorePlayer1 = 0;
    scorePlayer2 = 0;

    document.addEventListener('keydown', onKeyDown);

    animate();

    socket = io('http://localhost:3000');
    socket.on('playerNumber', (number) => {
        playerNumber = number;
        setCameraPosition();
    });
    socket.on('newPlayer', (number) => {
        if (number === 2) {
            alert('New player connected. Starting multiplayer game...');
            startMultiplayerGame();
        }
    });
    socket.on('startMultiplayerGame', startMultiplayerGame);
    socket.on('updatePaddle', (data) => {
        if (data.player === 1) {
            paddle1.position.set(data.position.x, paddle1.position.y, data.position.z);
        } else {
            paddle2.position.set(data.position.x, paddle2.position.y, data.position.z);
        }
    });
    socket.on('serveBall', () => {
        serveBall();
    });
    socket.on('resetGame', () => {
        alert('Player disconnected. Switching to single-player mode.');
        resetGame();
        gameMode = 'singleplayer';
        updateUI();
    });
    socket.on('playerLeft', () => {
        alert('Player disconnected.');
    });
}

function addBoundary(x, y, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, depth, height);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const boundary = new THREE.Mesh(geometry, material);
    boundary.position.set(x, depth / 2, y);
    scene.add(boundary);
}

function setCameraPosition() {
    if (playerNumber === 1) {
        camera.position.set(-15, 10, 0); // Adjust camera position for better view
        camera.lookAt(-9, 0.6, 0);
    } else if (playerNumber === 2) {
        camera.position.set(15, 10, 0); // Adjust camera position for better view
        camera.lookAt(9, 0.6, 0);
    }
    controls.update();
}

function startMultiplayerGame() {
    gameMode = 'multiplayer';
    resetGame();
    updateUI();
}

function updateUI() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Score: ${points[scorePlayer1]} - ${points[scorePlayer2]} (Games: ${games[0]} - ${games[1]})`;
    const gameInfoElement = document.getElementById('gameInfo');
    gameInfoElement.textContent = ballInPlay ? "" : `Player ${servingPlayer} serves. Press SPACE to serve.`;
}

function onKeyDown(event) {
    const paddleSpeed = 0.5;
    if (playerNumber) {
        switch (event.key) {
            case 'ArrowLeft': // Move left
                if (playerNumber === 1) {
                    paddle1.position.z = Math.max(paddle1.position.z - paddleSpeed, -4);
                    socket.emit('movePaddle', { player: 1, position: { x: paddle1.position.x, z: paddle1.position.z } });
                } else if (playerNumber === 2) {
                    paddle2.position.z = Math.max(paddle2.position.z - paddleSpeed, -4);
                    socket.emit('movePaddle', { player: 2, position: { x: paddle2.position.x, z: paddle2.position.z } });
                }
                break;
            case 'ArrowRight': // Move right
                if (playerNumber === 1) {
                    paddle1.position.z = Math.min(paddle1.position.z + paddleSpeed, 4);
                    socket.emit('movePaddle', { player: 1, position: { x: paddle1.position.x, z: paddle1.position.z } });
                } else if (playerNumber === 2) {
                    paddle2.position.z = Math.min(paddle2.position.z + paddleSpeed, 4);
                    socket.emit('movePaddle', { player: 2, position: { x: paddle2.position.x, z: paddle2.position.z } });
                }
                break;
            case 'ArrowDown': // Move down
                if (playerNumber === 1) {
                    paddle1.position.x = Math.max(paddle1.position.x - paddleSpeed, -9);
                    socket.emit('movePaddle', { player: 1, position: { x: paddle1.position.x, z: paddle1.position.z } });
                } else if (playerNumber === 2) {
                    paddle2.position.x = Math.max(paddle2.position.x - paddleSpeed, 9);
                    socket.emit('movePaddle', { player: 2, position: { x: paddle2.position.x, z: paddle2.position.z } });
                }
                break;
            case 'ArrowUp': // Move up
                if (playerNumber === 1) {
                    paddle1.position.x = Math.min(paddle1.position.x + paddleSpeed, -7);
                    socket.emit('movePaddle', { player: 1, position: { x: paddle1.position.x, z: paddle1.position.z } });
                } else if (playerNumber === 2) {
                    paddle2.position.x = Math.min(paddle2.position.x + paddleSpeed, 11);
                    socket.emit('movePaddle', { player: 2, position: { x: paddle2.position.x, z: paddle2.position.z } });
                }
                break;
        }
    }
    if (event.key === ' ' && !ballInPlay && playerNumber === servingPlayer) {
        serveBall();
        socket.emit('serveBall');
    }
}

function resetBall() {
    ball.position.set(0, 0.3, 0); // Altezza più bassa durante il reset
    ballSpeed.x = 0;
    ballSpeed.y = 0;
    ballSpeed.z = 0;
    ballInPlay = false;
}

function serveBall() {
    ballInPlay = true;
    if (servingPlayer === 1) {
        ball.position.set(-8.5, 0.5, 0); // Altezza di servizio più alta per evitare la rete
        ballSpeed.x = 0.3;
    } else {
        ball.position.set(8.5, 0.5, 0); // Altezza di servizio più alta per evitare la rete
        ballSpeed.x = -0.3;
    }
    ballSpeed.y = 0.1;
    ballSpeed.z = (Math.random() - 0.5) * 0.1;
}

function updateBall() {
    if (!ballInPlay) return;

    ball.position.x += ballSpeed.x;
    ball.position.y += ballSpeed.y;
    ball.position.z += ballSpeed.z;

    ballSpeed.y -= 0.003; // Gravità ridotta

    // Assicurarsi che la pallina non rimbalzi troppo in alto
    if (ball.position.y < 0.15) {
        ball.position.y = 0.15;
        ballSpeed.y = -ballSpeed.y * 0.7;

        // Controllo del doppio rimbalzo
        if (ball.position.x < -8.5 && servingPlayer === 1) {
            scorePoint(2);
        } else if (ball.position.x > 8.5 && servingPlayer === 2) {
            scorePoint(1);
        }
    }

    // Collisione con i confini
    if (ball.position.z > 4.75 || ball.position.z < -4.75) {
        ballSpeed.z = -ballSpeed.z;
    }

    // Collisione con le racchette
    if (ballCollidesWithPaddle(paddle1) || ballCollidesWithPaddle(paddle2)) {
        ballSpeed.x = -ballSpeed.x * 1.05;
        ballSpeed.z += (Math.random() - 0.5) * 0.02;
        ballSpeed.y = 0.1;
    }

    // Collisione con la rete
    if (ball.position.x < 0.2 && ball.position.x > -0.2 && ball.position.y < 0.6) {
        ballSpeed.x = -ballSpeed.x * 0.5;
    }

    // Controllo se la pallina è fuori dai limiti (punto segnato)
    if (ball.position.x > 9.75) {
        scorePoint(1);
    } else if (ball.position.x < -9.75) {
        scorePoint(2);
    }
}

function scorePoint(player) {
    if (player === 1) {
        scorePlayer1++;
        servingPlayer = 2;
    } else {
        scorePlayer2++;
        servingPlayer = 1;
    }

    if (scorePlayer1 >= 4 && scorePlayer1 >= scorePlayer2 + 2) {
        games[0]++;
        scorePlayer1 = 0;
        scorePlayer2 = 0;
    } else if (scorePlayer2 >= 4 && scorePlayer2 >= scorePlayer1 + 2) {
        games[1]++;
        scorePlayer1 = 0;
        scorePlayer2 = 0;
    }

    resetBall();
    updateUI();
}

function ballCollidesWithPaddle(paddle) {
    return (
        ball.position.x < paddle.position.x + 0.2 &&
        ball.position.x > paddle.position.x - 0.2 &&
        ball.position.z < paddle.position.z + 0.75 &&
        ball.position.z > paddle.position.z - 0.75 &&
        ball.position.y < paddle.position.y + 0.6 &&
        ball.position.y > paddle.position.y - 0.6
    );
}

function updateAI() {
    if (gameMode === 'singleplayer' && ballInPlay) {
        const aiSpeed = 0.05;
        if (ball.position.z > paddle2.position.z + 0.5) {
            paddle2.position.z = Math.min(paddle2.position.z + aiSpeed, 4);
        } else if (ball.position.z < paddle2.position.z - 0.5) {
            paddle2.position.z = Math.max(paddle2.position.z - aiSpeed, -4);
        }
    } else if (gameMode === 'singleplayer' && !ballInPlay && servingPlayer === 2) {
        setTimeout(serveBall, 1000);
    }
}

function animate() {
    requestAnimationFrame(animate);

    updateBall();
    updateAI();

    renderer.render(scene, camera);
}

function resetGame() {
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    games = [0, 0];
    resetBall();
    paddle1.position.set(-9, 0.6, 0);
    paddle2.position.set(9, 0.6, 0);
    servingPlayer = 1;
    updateUI();
}

init();

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
