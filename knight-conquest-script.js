let currentLevel = 0; // Променлива, която проследява настоящото ниво и се взима като индекс от масива с нивата
let boardState = JSON.parse(JSON.stringify(levels[currentLevel])); // Създаване на deep copy на конкретното ниво
let knightPosition = findKnightPosition(); // Викане на функция за намиране на координатите на коня на полето
let blackPieces = findBlackPieces(); // Викане на функция за намиране на всички черни фигури на полето
let validMoves = calculateValidMoves(knightPosition); // Викане на функция за изчисление на валидните придвижвания спрямо позицията на коня
let gameActive = true; // Булева променлива, проследяваща дали играта е активна (true), или приключила (false).

const chessboardContainer = document.getElementById("chessboard-container"); // Константа, взимаща контейнера за шахматното поле
const chessboard = document.getElementById("chessboard"); // Константа, взимаща шахматното поле
const popupLevelComplete = document.getElementById("popup-level-complete"); // Константа, взимаща екрана за минато ниво
const popupLevelLost = document.getElementById("popup-level-lost"); // Константа, взимаща екрана за загубено ниво
const popupGameComplete = document.getElementById("popup-game-complete"); // Константа, взимаща екрана за спечелена игра
const nextLevelButton = document.getElementById("next-level-btn"); // Константа, взимаща бутона за начало на следващо ниво
const retryButton = document.getElementById("retry-btn"); // Константа, взимаща бутона за започване на текущото ниво отначало

nextLevelButton.addEventListener("click", nextLevel); // Викане на функция при натискане на бутона за следващо ниво
retryButton.addEventListener("click", retryLevel); // Викане на функция при натискане на бутона за започване на текущото ниво отново
document.querySelectorAll(".quit-btn").forEach(button => { // При натискане на бутона за излизане, връща потребителя в зададената страница
    button.addEventListener("click", () => {
        window.location.href = "puzzle-library.html"; // Локация, към която да се пренасочи потребителят
    });
});

/* Функция, итерираща през всеки квадрат на шахматното поле, която проверява дали елементът във всеки квадрат е 2 или повече, ако да, към
   масива с черни фигури се добавя обект с атрибути тип, който е елемента от масива с нивата на конкретната позиция, както и x и y координати,
   съхранявайки позицията на фигурата. Вика се само веднъж в начало на ниво
*/
function findBlackPieces() {
    const pieces = [];
    for (let i = 0; i < 8; i++) { // Итериране през всеки ред
        for (let j = 0; j < 8; j++) { // Итериране през всяка колона от един ред
            if (boardState[i][j] >= 2) {
                pieces.push({ type: boardState[i][j], x: i, y: j });
            }
        }
    }
    return pieces; // Връщане на масива с елементи всички черни фигури с техния тип и координати
}

/* Функция, итерираща през всеки квадрат на полето, ако елемента е със стойност 1, се връща обект с атрибути x и y, представляващи
   позицията на коня на полето. Вика се само веднъж в начало на ниво.
*/
function findKnightPosition() {
    for (let i = 0; i < 8; i++) { // Итериране през всеки ред
        for (let j = 0; j < 8; j++) { // Итериране през всяка колона от един ред
            if (boardState[i][j] === 1) return { x: i, y: j };
        }
    }
}

/* Функция, създаваща масив с валидните движения на коня спрямо неговата позиция според стандартния начин за движение на коня.
   Връща се същият масив, филтриран само с координатите, които са в рамките на шахматното поле.
*/ 
function calculateValidMoves(position) {
    const possibleMoves = [
        { x: position.x + 2, y: position.y + 1 },
        { x: position.x + 2, y: position.y - 1 },
        { x: position.x - 2, y: position.y + 1 },
        { x: position.x - 2, y: position.y - 1 },
        { x: position.x + 1, y: position.y + 2 },
        { x: position.x + 1, y: position.y - 2 },
        { x: position.x - 1, y: position.y + 2 },
        { x: position.x - 1, y: position.y - 2 }
    ];

    return possibleMoves.filter(move => move.x >= 0 && move.x < 8 && move.y >= 0 && move.y < 8);
}

/* Функция за изграждане на шахматното поле визуално на страницата. Итерира се 64 пъти за всеки квадрат и се редува създаване на бял
   или черен квадрат. След това се проверява елементът в двумерния масив за текущото ниво и се изобразява като конкретна фигура в квадрата.
   Накрая се добавя eventListener за викане на функция при натискане на този квадрат и квадратът се добавя към шахматното поле. 
*/
function renderBoard() {
    chessboard.innerHTML = "";
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement("div"); // Създаване на квадрат под формата на div елемент
            square.classList.add((i + j) % 2 === 0 ? "white-square" : "black-square"); // Осов сбор: четен - бял квадрат; нечетен - черен квадрат

            if (boardState[i][j] === 1) square.innerText = "♘", square.style.color = "white", square.style.fontSize = "60px";
            else if (boardState[i][j] === 2) square.innerText = "♙", square.style.color = "black", square.style.fontSize = "60px";
            else if (boardState[i][j] === 3) square.innerText = "♖", square.style.color = "black", square.style.fontSize = "60px";
            else if (boardState[i][j] === 4) square.innerText = "♗", square.style.color = "black", square.style.fontSize = "60px";
            else if (boardState[i][j] === 5) square.innerText = "♕", square.style.color = "black", square.style.fontSize = "60px";

            square.addEventListener("click", () => handleSquareClick(i, j));
            chessboard.appendChild(square);
        }
    }
}

/* Функция, взимаща x и y като аргументи и ако играта е активна, проверява дали в масива с валидни движения съществува обект с тези
   координати. Ако да, се изпълняват долните функции. Накрая се проверява дали масивът с черни фигури е празен. Ако да, се вика или
   функция за спечелена игра, или функция за минато ниво
*/
function handleSquareClick(x, y) {
    if (!gameActive) return; // Ако играта е неактивна, нищо не се случва и долните редове не се изпълняват

    if (validMoves.some(pos => pos.x === x && pos.y === y)) {
        moveKnight(x, y); // Функция за придвижване на коня на конкретните координати x и y
        capturePieceIfPresent(x, y); // Функция за взимане на черна фигура, ако конят е на нейната позиция
        checkForCaptures(); // Функция, проверяваща дали някоя черна фигура заплашва коня
        if (blackPieces.length === 0) {
            // Ако сме на последното ниво, се вика функция за спечелена игра, в противен случай се вика функция за минато ниво
            currentLevel === levels.length - 1 ? showGameCompletePopup() : showLevelCompletePopup();
        }
    }
}

// Функция, приемаща параметри x и y - координатите на позицията, към която да се придвижи конят в полето.
function moveKnight(x, y) {
    boardState[knightPosition.x][knightPosition.y] = 0; // Старата позиция на коня става празна, отбелязва се с 0
    knightPosition = { x, y }; // Обновяване на позицията на коня с новата му такава
    boardState[x][y] = 1; // Обновяване на полето, на което се е придвижил конят
    validMoves = calculateValidMoves(knightPosition); // Изчисляване на валидните позиции спрямо новата позиция на коня 
    renderBoard(); // Обновяване на визуалната част на полето след извършеното движение
}

// Функция, приемаща параметри x и y, филтрираща масива с черните фигури, оставяща всички, освен тази, която е на координатите x и y
function capturePieceIfPresent(x, y) {
    blackPieces = blackPieces.filter(piece => !(piece.x === x && piece.y === y));
}

/* Функция, итерираща през всяка черна фигура в масива с черни фигури, проверяваща дали
   черната фигура може да вземе коня. Ако да, се вика функция за загуба на ниво.
*/
function checkForCaptures() {
    for (const piece of blackPieces) {
        if (canCaptureKnight(piece.type, piece.x, piece.y)) {
            showLevelLostPopup();
            return;
        }
    }
}

/* 
   Функция с параметри тип на фигура и координати x и y, която взима координатите на коня и проверява 
   според това каква е фигурата дали конят се намира на място на което спрямо типа фигура и нейната 
   позиция той ще бъде взет. Ако да, връща true (При случаи с топ, офицер или царица се вика функция
   за проверка дали някоя друга черна фигура не блокира пътя на фигурата), в противен случай - false
*/
function canCaptureKnight(type, x, y) {
    const knightX = knightPosition.x; 
    const knightY = knightPosition.y;

    // Пешка, проверяват се долните два диагонала спрямо нейната позиция
    if (type === 2 && knightX === x + 1 && Math.abs(knightY - y) === 1) return true;

    // Топ или царица, проверяват се докрай посоките горе, долу, дясно и ляво спрямо позицията на фигурата 
    if ((type === 3 || type === 5) && (knightX === x || knightY === y)) {
        return isPathClear(x, y, knightX, knightY);
    }

    // Офицер или царица, проверяват се докрай диагоналите в четирите посоки спрямо позицията на фигурата
    if ((type === 4 || type === 5) && Math.abs(knightX - x) === Math.abs(knightY - y)) {
        return isPathClear(x, y, knightX, knightY);
    }

    return false; // Фигурата не може да вземе коня
}

// Функция, проверяваща дали пътят между две точки на шахматното поле е чист, тоест няма фигури, които го блокират
function isPathClear(startX, startY, endX, endY) {
    // Определяне на посоката на движение по x и y
    const stepX = Math.sign(endX - startX);
    const stepY = Math.sign(endY - startY);
    // Задаване на началните координати, които ще се проверяват, като започва от първата стъпка след startX/startY.
    let x = startX + stepX;
    let y = startY + stepY;

    // Докато текущите координати (x, y) не достигнат крайните (endX, endY)
    while (x !== endX || y !== endY) {
        // Проверяване дали на текущата позиция на шахматното поле има фигура (стойност, различна от 0).
        if (boardState[x][y] !== 0) return false; // Ако има фигура, пътят не е чист, връща false.
        // Актуализират се координатите, като се придвижва с една стъпка в зададената посока.
        x += stepX;
        y += stepY;
    }
    return true; // Всички позиции между началната и крайната точка са празни, пътят е чист.
}

/* 
   Функция за зареждане на следващо ниво. променливата за следващо ниво се вдига с 1, за да се вземе следващия
   двумерен масив от масива с нива. След това проверява дали съществува следващо ниво в масива с нива. Ако да,
   то се зарежда, в противен случай, се показва прозорецът за спечелена игра.
*/
function nextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
        boardState = JSON.parse(JSON.stringify(levels[currentLevel])); // създаване на deep copy на новото ниво 
        knightPosition = findKnightPosition(); // Намиране на координатите на коня на полето за новото ниво
        blackPieces = findBlackPieces(); // Намиране на всички черни фигури на полето за новото ниво
        validMoves = calculateValidMoves(knightPosition); // Изчисление на валидните придвижвания на коня за новото ниво
        hidePopup(popupLevelComplete); // Скриване на екрана за минато ниво
        renderBoard(); // Визуализация на полето за новото ниво
    } else {
        showGameCompletePopup(); // Показване на екрана за спечелена игра
    }
}

// Функция за зареждане на текущото ниво отначало.
function retryLevel() {
    boardState = JSON.parse(JSON.stringify(levels[currentLevel])); // създаване на deep copy на нивото за започване отначало
    knightPosition = findKnightPosition(); // Намиране на координатите на коня на полето за нивото отначало
    blackPieces = findBlackPieces(); // Намиране на всички черни фигури на полето за нивото отначало
    validMoves = calculateValidMoves(knightPosition); // Изчисление на валидните придвижвания на коня за нивото отначало
    hidePopup(popupLevelLost); // Скриване на екрана за загубено ниво
    renderBoard(); // Визуализация на полето за нивото отначало
}

/* 
   Функция за показване на екран, приемащ параметър някой от екраните. Играта става неактивна и класът hidden, 
   правещ екраните невидими, се маха от конкретния екран, което визуализира екрана в страницата 
*/
function showPopup(popup) {
    gameActive = false;
    popup.classList.remove("hidden");
}

/* 
   Функция за скриване на екран, приемащ параметър някой от екраните. Играта става активна и класът hidden,
   правещ екраните невидими, се добавя към конкретния екран, което премахва визуализирания екран в страницата
*/ 
function hidePopup(popup) {
    gameActive = true;
    popup.classList.add("hidden");
}

// Показване на екрана за минато ниво, викащ функцията за показване на екран с параметър взетия елемент за екран за минато ниво
function showLevelCompletePopup() {
    showPopup(popupLevelComplete);
}

// Показване на екрана за загуба на ниво, викащ функцията за показване на екран с параметър взетия елемент за екран за загуба на ниво
function showLevelLostPopup() {
    showPopup(popupLevelLost);
}

// Показване на екрана за спечелена игра, викащ функцията за показване на екран с параметър взетия елемент за екран за спечелена игра
function showGameCompletePopup() {
    showPopup(popupGameComplete);
}

renderBoard(); // Начална визуализация на шахматното поле