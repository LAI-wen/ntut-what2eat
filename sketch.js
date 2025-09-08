// === CYBER APPETITE SYSTEM ===
// 賽博食慾：數據流動抽籤系統

// 系統狀態
let systemState = 'IDLE'; // IDLE, DECODING, DECODED
let decodeTimer = 0;
let decodeDuration = 2500;

// 數據流系統
let dataStreams = [];
let streamCount = 8;
let glitchParticles = [];

// 色彩系統 - 賽博龐克調色板
const CYBER_COLORS = {
    bg: [10, 10, 10],
    primary: [255, 255, 255],
    neon_pink: [255, 0, 255],
    neon_cyan: [0, 255, 255],
    neon_green: [0, 255, 127],
    neon_yellow: [255, 255, 0],
    grid: [40, 40, 40]
};

// 餐廳資料庫
const FOOD_DATABASE = [
    { name: "阿姨麵攤", type: "CHINESE", price: "NT$ 50-100", distance: "180M", id: "0x1A2F", address: "台北市大安區忠孝東路三段1號" },
    { name: "日式拉麵", type: "JAPANESE", price: "NT$ 150-250", distance: "220M", id: "0x2B3G", address: "台北市大安區基隆路四段43號" },
    { name: "鹹酥雞攤", type: "TAIWANESE", price: "NT$ 80-150", distance: "95M", id: "0x3C4H", address: "台北市大安區復興南路一段390號" },
    { name: "便當店", type: "CHINESE", price: "NT$ 70-120", distance: "160M", id: "0x4D5I", address: "台北市大安區建國南路二段151號" },
    { name: "手搖飲料", type: "BEVERAGE", price: "NT$ 30-80", distance: "45M", id: "0x5E6J", address: "台北市大安區忠孝東路三段96號" },
    { name: "義大利麵", type: "ITALIAN", price: "NT$ 180-300", distance: "350M", id: "0x6F7K", address: "台北市大安區市民大道四段100號" },
    { name: "滷味攤", type: "TAIWANESE", price: "NT$ 60-100", distance: "130M", id: "0x7G8L", address: "台北市大安區光復南路290號" },
    { name: "早餐店", type: "MIXED", price: "NT$ 40-80", distance: "75M", id: "0x8H9M", address: "台北市大安區忠孝東路四段2號" },
    { name: "韓式料理", type: "KOREAN", price: "NT$ 200-350", distance: "280M", id: "0x9I0N", address: "台北市大安區敦化南路一段187號" },
    { name: "泰式餐廳", type: "THAI", price: "NT$ 120-200", distance: "190M", id: "0xAJ1O", address: "台北市大安區仁愛路四段300號" },
    { name: "素食自助餐", type: "VEGETARIAN", price: "NT$ 80-150", distance: "240M", id: "0xBK2P", address: "台北市大安區信義路四段6號" },
    { name: "牛排館", type: "WESTERN", price: "NT$ 300-500", distance: "420M", id: "0xCL3Q", address: "台北市大安區延吉街131號" }
];

let selectedFood = null;
let decodeHistory = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // 初始化數據流
    initDataStreams();
    
    // 設定按鈕事件
    const decodeBtn = document.getElementById('decode-btn');
    decodeBtn.addEventListener('click', startDecoding);
    
    const mapsBtn = document.getElementById('maps-btn');
    mapsBtn.addEventListener('click', openGoogleMaps);
    
    // 載入歷史記錄
    loadHistory();
    
    // 字體設定
    textFont('Noto Serif TC');
}

function draw() {
    // 背景
    background(CYBER_COLORS.bg[0], CYBER_COLORS.bg[1], CYBER_COLORS.bg[2]);
    
    // 繪製網格背景
    drawCyberGrid();
    
    // 更新和繪製數據流
    updateDataStreams();
    drawDataStreams();
    
    // 處理故障粒子
    updateGlitchParticles();
    drawGlitchParticles();
    
    // 根據系統狀態執行對應動畫
    switch(systemState) {
        case 'DECODING':
            handleDecodingAnimation();
            break;
        case 'DECODED':
            drawDecodedResult();
            break;
    }
    
    // 繪製掃描線效果
    drawScanLines();
    
    // 管理背景遮罩
    manageOverlayMask();
}

function initDataStreams() {
    dataStreams = [];
    for (let i = 0; i < streamCount; i++) {
        let stream = {
            x: (width / streamCount) * i + random(-50, 50),
            words: [],
            speed: random(0.5, 2),
            glitchChance: 0.001
        };
        
        // 為每個流添加隨機餐廳名稱
        for (let j = 0; j < 15; j++) {
            let word = {
                text: random(FOOD_DATABASE).name,
                y: random(-height, 0),
                alpha: random(100, 255),
                size: random(12, 20),
                glitching: false,
                glitchTimer: 0
            };
            stream.words.push(word);
        }
        
        dataStreams.push(stream);
    }
}

function drawCyberGrid() {
    stroke(CYBER_COLORS.grid[0], CYBER_COLORS.grid[1], CYBER_COLORS.grid[2], 30);
    strokeWeight(1);
    
    // 垂直線
    for (let x = 0; x < width; x += 100) {
        line(x, 0, x, height);
    }
    
    // 水平線
    for (let y = 0; y < height; y += 100) {
        line(0, y, width, y);
    }
}

function updateDataStreams() {
    for (let stream of dataStreams) {
        for (let word of stream.words) {
            // 向下移動
            word.y += stream.speed;
            
            // 重置到頂部
            if (word.y > height + 50) {
                word.y = -random(50, 200);
                word.text = random(FOOD_DATABASE).name;
                word.alpha = random(100, 255);
            }
            
            // 滑鼠碰撞檢測
            let distance = dist(mouseX, mouseY, stream.x, word.y);
            if (distance < 40 && !word.glitching) {
                triggerGlitch(stream.x, word.y, word.text);
                word.glitching = true;
                word.glitchTimer = 30;
            }
            
            // 故障計時器
            if (word.glitching) {
                word.glitchTimer--;
                if (word.glitchTimer <= 0) {
                    word.glitching = false;
                }
            }
        }
    }
}

function drawDataStreams() {
    for (let stream of dataStreams) {
        for (let word of stream.words) {
            push();
            
            if (word.glitching) {
                // 故障效果
                translate(random(-3, 3), random(-3, 3));
                fill(random([CYBER_COLORS.neon_pink, CYBER_COLORS.neon_cyan, CYBER_COLORS.neon_yellow]));
            } else {
                fill(CYBER_COLORS.primary[0], CYBER_COLORS.primary[1], CYBER_COLORS.primary[2], word.alpha);
            }
            
            noStroke();
            textAlign(CENTER);
            textSize(word.size);
            text(word.text, stream.x, word.y);
            
            pop();
        }
    }
}

function triggerGlitch(x, y, text) {
    // 創建故障粒子
    for (let i = 0; i < 20; i++) {
        let particle = {
            x: x + random(-20, 20),
            y: y + random(-10, 10),
            vx: random(-5, 5),
            vy: random(-5, 5),
            life: 30,
            maxLife: 30,
            color: random([CYBER_COLORS.neon_pink, CYBER_COLORS.neon_cyan, CYBER_COLORS.neon_green]),
            char: random(text.split(''))
        };
        glitchParticles.push(particle);
    }
}

function updateGlitchParticles() {
    for (let i = glitchParticles.length - 1; i >= 0; i--) {
        let p = glitchParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        
        if (p.life <= 0) {
            glitchParticles.splice(i, 1);
        }
    }
}

function drawGlitchParticles() {
    for (let p of glitchParticles) {
        push();
        let alpha = map(p.life, 0, p.maxLife, 0, 255);
        fill(p.color[0], p.color[1], p.color[2], alpha);
        noStroke();
        textAlign(CENTER);
        textSize(random(10, 16));
        text(p.char, p.x, p.y);
        pop();
    }
}

function startDecoding() {
    if (systemState !== 'IDLE') return;
    
    systemState = 'DECODING';
    decodeTimer = 0;
    
    // 按鈕故障效果
    const btn = document.getElementById('decode-btn');
    btn.classList.add('decoding');
    btn.textContent = 'DECODING_IN_PROGRESS...';
    
    // 加速數據流
    for (let stream of dataStreams) {
        stream.speed *= 3;
    }
}

function handleDecodingAnimation() {
    decodeTimer += deltaTime;
    
    // 創建隨機故障效果
    if (frameCount % 5 === 0) {
        let randomStream = random(dataStreams);
        let randomWord = random(randomStream.words);
        triggerGlitch(randomStream.x, randomWord.y, randomWord.text);
    }
    
    // 解碼完成
    if (decodeTimer >= decodeDuration) {
        finishDecoding();
    }
}

function finishDecoding() {
    systemState = 'DECODED';
    
    // 選擇隨機餐廳
    selectedFood = random(FOOD_DATABASE);
    
    // 重置按鈕
    const btn = document.getElementById('decode-btn');
    btn.classList.remove('decoding');
    btn.textContent = 'DECODE LUNCH_PROTOCOL';
    
    // 恢復數據流速度
    for (let stream of dataStreams) {
        stream.speed /= 3;
    }
    
    // 顯示結果
    showDecodedResult();
    
    // 加入歷史記錄
    addToHistory(selectedFood);
    
    // 5秒後重置
    setTimeout(() => {
        systemState = 'IDLE';
        hideResult();
    }, 5000);
}

function showDecodedResult() {
    const resultDisplay = document.getElementById('result-display');
    const nameElement = document.getElementById('restaurant-name');
    const detailsElement = document.getElementById('restaurant-details');
    
    nameElement.textContent = selectedFood.name;
    nameElement.classList.add('glitch-text');
    
    detailsElement.innerHTML = `
        TYPE: ${selectedFood.type}<br>
        PRICE_RANGE: ${selectedFood.price}<br>
        DISTANCE: ${selectedFood.distance}<br>
        FOOD_ID: ${selectedFood.id}
    `;
    
    resultDisplay.style.opacity = '1';
    
    // 顯示 Google Maps 按鈕
    const mapsBtn = document.getElementById('maps-btn');
    mapsBtn.style.display = 'block';
    
    // 移除故障效果
    setTimeout(() => {
        nameElement.classList.remove('glitch-text');
    }, 1000);
}

function hideResult() {
    const resultDisplay = document.getElementById('result-display');
    const mapsBtn = document.getElementById('maps-btn');
    resultDisplay.style.opacity = '0';
    mapsBtn.style.display = 'none';
    selectedFood = null;
}

function drawDecodedResult() {
    if (!selectedFood) return;
    
    // 在結果周圍繪製掃描框
    push();
    stroke(CYBER_COLORS.neon_green[0], CYBER_COLORS.neon_green[1], CYBER_COLORS.neon_green[2], 150);
    strokeWeight(2);
    noFill();
    
    let boxWidth = 400;
    let boxHeight = 200;
    let x = width/2 - boxWidth/2;
    let y = height/2 - boxHeight/2;
    
    rect(x, y, boxWidth, boxHeight);
    
    // 角落裝飾
    line(x, y, x + 20, y);
    line(x, y, x, y + 20);
    line(x + boxWidth, y, x + boxWidth - 20, y);
    line(x + boxWidth, y, x + boxWidth, y + 20);
    line(x, y + boxHeight, x + 20, y + boxHeight);
    line(x, y + boxHeight, x, y + boxHeight - 20);
    line(x + boxWidth, y + boxHeight, x + boxWidth - 20, y + boxHeight);
    line(x + boxWidth, y + boxHeight, x + boxWidth, y + boxHeight - 20);
    
    pop();
}

function drawScanLines() {
    if (systemState === 'DECODING') {
        stroke(CYBER_COLORS.neon_cyan[0], CYBER_COLORS.neon_cyan[1], CYBER_COLORS.neon_cyan[2], 30);
        strokeWeight(1);
        
        for (let i = 0; i < 5; i++) {
            let y = (frameCount * 3 + i * 100) % height;
            line(0, y, width, y);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initDataStreams();
}

// === 新增功能函數 ===

function manageOverlayMask() {
    const mask = document.getElementById('overlay-mask');
    const historyPanel = document.getElementById('history-panel');
    
    if (systemState === 'DECODED') {
        mask.classList.add('active');
        historyPanel.classList.add('active');
    } else {
        mask.classList.remove('active');
        historyPanel.classList.remove('active');
    }
}

function addToHistory(food) {
    const timestamp = new Date().toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const historyItem = {
        ...food,
        timestamp: timestamp,
        id: Date.now()
    };
    
    // 加到歷史記錄開頭
    decodeHistory.unshift(historyItem);
    
    // 限制歷史記錄數量
    if (decodeHistory.length > 10) {
        decodeHistory.pop();
    }
    
    // 儲存到 localStorage
    saveHistory();
    
    // 更新顯示
    updateHistoryDisplay();
}

function loadHistory() {
    const saved = localStorage.getItem('ntut-food-history');
    if (saved) {
        decodeHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

function saveHistory() {
    localStorage.setItem('ntut-food-history', JSON.stringify(decodeHistory));
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    
    if (decodeHistory.length === 0) {
        historyList.innerHTML = '<div style="color: #666; text-align: center; margin: 20px 0;">NO_DECODE_RECORDS</div>';
        return;
    }
    
    historyList.innerHTML = decodeHistory.map(item => `
        <div class="history-item" onclick="openGoogleMapsFromHistory('${item.address}', '${item.name}')">
            <div class="history-item-name">${item.name}</div>
            <div class="history-item-details">
                ${item.type} | ${item.price}<br>
                DIST: ${item.distance}
            </div>
            <div class="history-item-time">${item.timestamp}</div>
        </div>
    `).join('');
}

function openGoogleMaps() {
    if (!selectedFood) return;
    
    const query = encodeURIComponent(selectedFood.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
}

function openGoogleMapsFromHistory(address, name) {
    const query = encodeURIComponent(address + ' ' + name);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
}

// 鍵盤快捷鍵
function keyPressed() {
    if (key === ' ') {
        startDecoding();
    }
    if (key === 'r') {
        initDataStreams();
    }
    if (key === 'h') {
        const historyPanel = document.getElementById('history-panel');
        historyPanel.classList.toggle('active');
    }
}