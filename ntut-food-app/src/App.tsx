import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

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

let decodeHistory: any[] = [];

function App() {
  const p5ContainerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!p5ContainerRef.current) return;

    const sketch = (p: p5) => {
      // === CYBER APPETITE SYSTEM ===
      let systemState = 'IDLE'; // IDLE, DECODING, DECODED
      let decodeTimer = 0;
      let decodeDuration = 2500;
      
      // 數據流系統
      let dataStreams: any[] = [];
      let streamCount = 8;
      let glitchParticles: any[] = [];
      
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
      
      let selectedFood: any = null;

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        initDataStreams();
        
        // 設定按鈕事件
        const decodeBtn = document.getElementById('decode-btn');
        const mapsBtn = document.getElementById('maps-btn');
        
        if (decodeBtn) {
          decodeBtn.addEventListener('click', startDecoding);
        }
        
        if (mapsBtn) {
          mapsBtn.addEventListener('click', openGoogleMaps);
        }
        
        // 載入歷史記錄
        loadHistory();
      };

      p.draw = () => {
        // 背景
        p.background(CYBER_COLORS.bg[0], CYBER_COLORS.bg[1], CYBER_COLORS.bg[2]);
        
        // 繪製網格背景
        drawCyberGrid();
        
        // 更新和繪製數據流
        updateDataStreams();
        drawDataStreams();
        
        // 處理故障粒子
        updateGlitchParticles();
        drawGlitchParticles();
        
        // 根據系統狀態執行對應動畫
        if (systemState === 'DECODING') {
          handleDecodingAnimation();
        } else if (systemState === 'DECODED') {
          drawDecodedResult();
        }
        
        // 繪製掃描線效果
        drawScanLines();
        
        // 管理背景遮罩
        manageOverlayMask();
      };

      const initDataStreams = () => {
        dataStreams = [];
        for (let i = 0; i < streamCount; i++) {
          let stream = {
            x: (p.width / streamCount) * i + p.random(-50, 50),
            words: [] as any[],
            speed: p.random(0.5, 2),
            glitchChance: 0.001
          };
          
          // 為每個流添加隨機餐廳名稱
          for (let j = 0; j < 15; j++) {
            let word = {
              text: p.random(FOOD_DATABASE).name,
              y: p.random(-p.height, 0),
              alpha: p.random(100, 255),
              size: p.random(12, 20),
              glitching: false,
              glitchTimer: 0
            };
            stream.words.push(word);
          }
          
          dataStreams.push(stream);
        }
      };

      const drawCyberGrid = () => {
        p.stroke(CYBER_COLORS.grid[0], CYBER_COLORS.grid[1], CYBER_COLORS.grid[2], 30);
        p.strokeWeight(1);
        
        // 垂直線
        for (let x = 0; x < p.width; x += 100) {
          p.line(x, 0, x, p.height);
        }
        
        // 水平線
        for (let y = 0; y < p.height; y += 100) {
          p.line(0, y, p.width, y);
        }
      };

      const updateDataStreams = () => {
        for (let stream of dataStreams) {
          for (let word of stream.words) {
            // 向下移動
            word.y += stream.speed;
            
            // 重置到頂部
            if (word.y > p.height + 50) {
              word.y = -p.random(50, 200);
              word.text = p.random(FOOD_DATABASE).name;
              word.alpha = p.random(100, 255);
            }
            
            // 滑鼠碰撞檢測
            let distance = p.dist(p.mouseX, p.mouseY, stream.x, (word as any).y);
            if (distance < 40 && !(word as any).glitching) {
              triggerGlitch(stream.x, (word as any).y, (word as any).text);
              (word as any).glitching = true;
              (word as any).glitchTimer = 30;
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
      };

      const drawDataStreams = () => {
        for (let stream of dataStreams) {
          for (let word of stream.words) {
            p.push();
            
            if (word.glitching) {
              // 故障效果
              p.translate(p.random(-3, 3), p.random(-3, 3));
              p.fill(p.random([CYBER_COLORS.neon_pink, CYBER_COLORS.neon_cyan, CYBER_COLORS.neon_yellow]));
            } else {
              p.fill(CYBER_COLORS.primary[0], CYBER_COLORS.primary[1], CYBER_COLORS.primary[2], word.alpha);
            }
            
            p.noStroke();
            p.textAlign(p.CENTER);
            p.textSize(word.size);
            p.text(word.text, stream.x, word.y);
            
            p.pop();
          }
        }
      };

      const triggerGlitch = (x: number, y: number, text: string) => {
        // 創建故障粒子
        for (let i = 0; i < 20; i++) {
          let particle = {
            x: x + p.random(-20, 20),
            y: y + p.random(-10, 10),
            vx: p.random(-5, 5),
            vy: p.random(-5, 5),
            life: 30,
            maxLife: 30,
            color: p.random([CYBER_COLORS.neon_pink, CYBER_COLORS.neon_cyan, CYBER_COLORS.neon_green]) as number[],
            char: p.random(text.split(''))
          };
          glitchParticles.push(particle);
        }
      };

      const updateGlitchParticles = () => {
        for (let i = glitchParticles.length - 1; i >= 0; i--) {
          let particle = glitchParticles[i];
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life--;
          
          if (particle.life <= 0) {
            glitchParticles.splice(i, 1);
          }
        }
      };

      const drawGlitchParticles = () => {
        for (let particle of glitchParticles) {
          p.push();
          let alpha = p.map(particle.life, 0, particle.maxLife, 0, 255);
          p.fill(particle.color[0], particle.color[1], particle.color[2], alpha);
          p.noStroke();
          p.textAlign(p.CENTER);
          p.textSize(p.random(10, 16));
          p.text(particle.char, particle.x, particle.y);
          p.pop();
        }
      };

      const startDecoding = () => {
        if (systemState !== 'IDLE') return;
        
        systemState = 'DECODING';
        decodeTimer = 0;
        
        // 按鈕故障效果
        const btn = document.getElementById('decode-btn');
        if (btn) {
          btn.classList.add('decoding');
          btn.textContent = 'DECODING_IN_PROGRESS...';
        }
        
        // 加速數據流
        for (let stream of dataStreams) {
          stream.speed *= 3;
        }
      };

      const handleDecodingAnimation = () => {
        decodeTimer += p.deltaTime;
        
        // 創建隨機故障效果
        if (p.frameCount % 5 === 0) {
          let randomStream = p.random(dataStreams) as any;
          if (randomStream && randomStream.words.length > 0) {
            let randomWord = p.random(randomStream.words) as any;
            if (randomWord) {
              triggerGlitch(randomStream.x, randomWord.y, randomWord.text);
            }
          }
        }
        
        // 解碼完成
        if (decodeTimer >= decodeDuration) {
          finishDecoding();
        }
      };

      const finishDecoding = () => {
        systemState = 'DECODED';
        
        // 選擇隨機餐廳
        selectedFood = p.random(FOOD_DATABASE);
        
        // 重置按鈕
        const btn = document.getElementById('decode-btn');
        if (btn) {
          btn.classList.remove('decoding');
          btn.textContent = 'DECODE LUNCH_PROTOCOL';
        }
        
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
      };

      const showDecodedResult = () => {
        const resultDisplay = document.getElementById('result-display');
        const nameElement = document.getElementById('restaurant-name');
        const detailsElement = document.getElementById('restaurant-details');
        const mapsBtn = document.getElementById('maps-btn');
        
        if (nameElement) {
          nameElement.textContent = selectedFood.name;
          nameElement.classList.add('glitch-text');
        }
        
        if (detailsElement) {
          detailsElement.innerHTML = `
            TYPE: ${selectedFood.type}<br>
            PRICE_RANGE: ${selectedFood.price}<br>
            DISTANCE: ${selectedFood.distance}<br>
            FOOD_ID: ${selectedFood.id}
          `;
        }
        
        if (resultDisplay) {
          resultDisplay.style.opacity = '1';
        }
        
        if (mapsBtn) {
          mapsBtn.style.display = 'block';
        }
        
        // 移除故障效果
        setTimeout(() => {
          if (nameElement) {
            nameElement.classList.remove('glitch-text');
          }
        }, 1000);
      };

      const hideResult = () => {
        const resultDisplay = document.getElementById('result-display');
        const mapsBtn = document.getElementById('maps-btn');
        
        if (resultDisplay) {
          resultDisplay.style.opacity = '0';
        }
        
        if (mapsBtn) {
          mapsBtn.style.display = 'none';
        }
        
        selectedFood = null;
      };

      const drawDecodedResult = () => {
        if (!selectedFood) return;
        
        // 在結果周圍繪製掃描框
        p.push();
        p.stroke(CYBER_COLORS.neon_green[0], CYBER_COLORS.neon_green[1], CYBER_COLORS.neon_green[2], 150);
        p.strokeWeight(2);
        p.noFill();
        
        let boxWidth = 400;
        let boxHeight = 200;
        let x = p.width/2 - boxWidth/2;
        let y = p.height/2 - boxHeight/2;
        
        p.rect(x, y, boxWidth, boxHeight);
        
        // 角落裝飾
        p.line(x, y, x + 20, y);
        p.line(x, y, x, y + 20);
        p.line(x + boxWidth, y, x + boxWidth - 20, y);
        p.line(x + boxWidth, y, x + boxWidth, y + 20);
        p.line(x, y + boxHeight, x + 20, y + boxHeight);
        p.line(x, y + boxHeight, x, y + boxHeight - 20);
        p.line(x + boxWidth, y + boxHeight, x + boxWidth - 20, y + boxHeight);
        p.line(x + boxWidth, y + boxHeight, x + boxWidth, y + boxHeight - 20);
        
        p.pop();
      };

      const drawScanLines = () => {
        if (systemState === 'DECODING') {
          p.stroke(CYBER_COLORS.neon_cyan[0], CYBER_COLORS.neon_cyan[1], CYBER_COLORS.neon_cyan[2], 30);
          p.strokeWeight(1);
          
          for (let i = 0; i < 5; i++) {
            let y = (p.frameCount * 3 + i * 100) % p.height;
            p.line(0, y, p.width, y);
          }
        }
      };

      const manageOverlayMask = () => {
        const mask = document.getElementById('overlay-mask');
        
        if (systemState === 'DECODED') {
          if (mask) mask.classList.add('active');
        } else {
          if (mask) mask.classList.remove('active');
        }
      };

      const addToHistory = (food: any) => {
        const timestamp = new Date().toLocaleTimeString('zh-TW', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        const historyItem = {
          restaurant: food,
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
      };

      const loadHistory = () => {
        const saved = localStorage.getItem('ntut-food-history');
        if (saved) {
          decodeHistory = JSON.parse(saved);
          updateHistoryDisplay();
        }
      };

      const saveHistory = () => {
        localStorage.setItem('ntut-food-history', JSON.stringify(decodeHistory));
      };

      const updateHistoryDisplay = () => {
        const historyList = document.getElementById('history-list');
        
        if (!historyList) return;
        
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
      };

      const openGoogleMaps = () => {
        if (!selectedFood) return;
        
        const query = encodeURIComponent(selectedFood.address);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, '_blank');
      };

      // 將函數掛到全局
      (window as any).openGoogleMapsFromHistory = (address: string, name: string) => {
        const query = encodeURIComponent(address + ' ' + name);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, '_blank');
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initDataStreams();
      };

      // 鍵盤快捷鍵
      p.keyPressed = () => {
        if (p.key === ' ') {
          startDecoding();
        }
        if (p.key === 'r') {
          initDataStreams();
        }
      };
    };

    // 創建 p5 實例
    p5InstanceRef.current = new p5(sketch, p5ContainerRef.current);

    // 清理函數
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* p5.js 畫布容器 */}
      <div ref={p5ContainerRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
      
      {/* UI 覆蓋層 - 完全復制原 HTML 結構 */}
      <div id="ui-overlay" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100
      }}>
        <div id="header" style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          color: '#ffffff',
          fontSize: '14px',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 300,
          opacity: 0.7
        }}>
          NTUT.CULINARY_PROTOCOL v2.1<br />
          STATUS: READY_FOR_DECODE
        </div>
        
        <div id="data-stream" style={{
          position: 'absolute',
          top: '20px',
          right: '30px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: '#00ff7f',
          opacity: 0.6,
          writingMode: 'vertical-rl' as any,
          textOrientation: 'mixed' as any
        }}>
          SCANNING_FOOD_DATABASE...<br />
          NEURAL_TASTE_NETWORK_ONLINE<br />
          HUNGER_LEVEL: MODERATE<br />
          LOCATION: TAIPEI_TECH
        </div>
        
        <button id="decode-btn" style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '15px 40px',
          border: '2px solid #ffffff',
          background: 'transparent',
          color: '#ffffff',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '16px',
          fontWeight: 400,
          cursor: 'pointer',
          pointerEvents: 'auto',
          transition: 'all 0.3s ease',
          letterSpacing: '2px'
        }}>
          DECODE LUNCH_PROTOCOL
        </button>
        
        <div id="result-display" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#ffffff',
          opacity: 0,
          transition: 'opacity 0.5s ease'
        }}>
          <div id="restaurant-name" style={{
            fontSize: '4rem',
            fontWeight: 600,
            marginBottom: '20px',
            textShadow: '0 0 30px #ff00ff66'
          }}></div>
          <div id="restaurant-details" style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '18px',
            lineHeight: 1.6,
            opacity: 0.8
          }}></div>
          <button id="maps-btn" 
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = '#00ff7f';
              (e.target as HTMLButtonElement).style.color = '#000000';
              (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0, 255, 127, 0.5)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = 'transparent';
              (e.target as HTMLButtonElement).style.color = '#00ff7f';
              (e.target as HTMLButtonElement).style.boxShadow = 'none';
            }}
            style={{
            display: 'none',
            marginTop: '20px',
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid #00ff7f',
            color: '#00ff7f',
            fontFamily: 'JetBrains Mono, monospace',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            pointerEvents: 'auto'
          }}>
            NAVIGATE_TO_LOCATION
          </button>
        </div>
        
        {/* 歷史紀錄切換按鈕 */}
        <button 
          onClick={() => setShowHistory(!showHistory)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 200,
            padding: '10px 15px',
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid #00ff7f',
            color: '#00ff7f',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.3s ease',
            pointerEvents: 'auto'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.background = '#00ff7f';
            (e.target as HTMLButtonElement).style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.background = 'rgba(0, 0, 0, 0.8)';
            (e.target as HTMLButtonElement).style.color = '#00ff7f';
          }}
        >
          {showHistory ? 'HIDE_HISTORY' : 'SHOW_HISTORY'}
        </button>

        <div id="history-panel" style={{
          position: 'fixed',
          top: showHistory ? '70px' : '-100%',
          right: '20px',
          width: typeof window !== 'undefined' && window.innerWidth <= 768 ? 'calc(100vw - 40px)' : '300px',
          maxHeight: typeof window !== 'undefined' && window.innerWidth <= 768 ? '50vh' : '70vh',
          overflowY: 'auto',
          background: 'rgba(0, 0, 0, 0.95)',
          border: '1px solid #00ff7f',
          borderRadius: '8px',
          padding: '15px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: '#ffffff',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          pointerEvents: showHistory ? 'auto' : 'none',
          zIndex: 150,
          backdropFilter: 'blur(10px)',
          boxShadow: showHistory ? '0 8px 32px rgba(0, 255, 127, 0.3)' : 'none'
        }}>
          <div id="history-title" style={{
            color: '#00ff7f',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '15px',
            textAlign: 'center',
            borderBottom: '1px solid #333',
            paddingBottom: '10px'
          }}>
            DECODE_HISTORY
          </div>
          <div id="history-list"></div>
        </div>
      </div>
      
      <div id="overlay-mask" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        zIndex: 50
      }} />

      {/* 加入原本的 CSS 動畫 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;600&family=JetBrains+Mono:wght@300;400;500&display=swap');
        
        body {
          font-family: 'Noto Serif TC', serif;
          margin: 0;
          overflow: hidden;
          cursor: crosshair;
        }
        
        #decode-btn:hover {
          background: #ffffff !important;
          color: #0a0a0a !important;
          box-shadow: 0 0 20px #ffffff33;
        }
        
        #decode-btn.decoding {
          animation: glitch-btn 0.2s infinite;
          border-color: #ff00ff !important;
          color: #ff00ff !important;
        }
        
        @keyframes glitch-btn {
          0%, 100% { transform: translateX(-50%) translate(0); }
          20% { transform: translateX(-50%) translate(-2px, 2px); }
          40% { transform: translateX(-50%) translate(-2px, -2px); }
          60% { transform: translateX(-50%) translate(2px, 2px); }
          80% { transform: translateX(-50%) translate(2px, -2px); }
        }
        
        .glitch-text {
          animation: glitch-text 0.3s ease-in-out;
        }
        
        @keyframes glitch-text {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); color: #ff00ff; }
          40% { transform: translate(-2px, -2px); color: #00ffff; }
          60% { transform: translate(2px, 2px); color: #ffff00; }
          80% { transform: translate(2px, -2px); color: #ff00ff; }
        }
        
        
        #overlay-mask.active {
          opacity: 1 !important;
        }

        /* 響應式設計 */
        @media (max-width: 768px) {
          #header {
            font-size: 12px !important;
            top: 15px !important;
            left: 15px !important;
          }
          
          #decoded-result {
            padding: 20px !important;
            font-size: 2.5rem !important;
          }
          
          #decoded-info {
            font-size: 14px !important;
          }
          
          #decode-button {
            bottom: 30px !important;
            padding: 12px 20px !important;
            font-size: 14px !important;
          }
        }

        @media (max-width: 480px) {
          #decoded-result {
            font-size: 2rem !important;
          }
          
          #decode-button {
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: calc(100% - 40px) !important;
            max-width: 300px !important;
          }
        }
        
        .history-item {
          margin-bottom: 12px;
          padding: 10px;
          border: 1px solid #333;
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .history-item:hover {
          border-color: #00ff7f;
          background: rgba(0, 255, 127, 0.05);
          box-shadow: 0 0 10px rgba(0, 255, 127, 0.2);
        }
        
        .history-item-name {
          font-size: 13px;
          font-weight: 500;
          color: #ffffff;
          margin-bottom: 5px;
        }
        
        .history-item-details {
          font-size: 10px;
          color: #999;
          line-height: 1.4;
        }
        
        .history-item-time {
          font-size: 9px;
          color: #666;
          margin-top: 5px;
          text-align: right;
        }
      `}</style>
    </>
  );
}

export default App;