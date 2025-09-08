# NTUT 食慾編碼 2.0 - React + TypeScript

## 🎯 專案概述

將原本的 p5.js 原型升級為現代化的 React + TypeScript 應用，整合賽博龐克風格的視覺效果與實用的餐廳推薦功能。

## 🛠️ 技術棧

- **前端框架**: React 19 + TypeScript
- **構建工具**: Vite 7
- **樣式**: Tailwind CSS 4
- **狀態管理**: Zustand
- **視覺效果**: p5.js 2.0
- **部署**: Vercel (計劃)

## 📁 專案結構

```
src/
├── components/
│   ├── P5Canvas.tsx          # p5.js React 整合元件
│   └── UI/                   # UI 元件
│       ├── Header.tsx        # 系統狀態標頭
│       ├── DataStream.tsx    # 右側資訊流
│       ├── DecodeButton.tsx  # 解碼按鈕
│       ├── ResultDisplay.tsx # 結果顯示
│       ├── HistoryPanel.tsx  # 歷史記錄面板
│       └── OverlayMask.tsx   # 背景遮罩
├── store/
│   └── useAppStore.ts        # Zustand 狀態管理
├── types/
│   └── index.ts              # TypeScript 類型定義
├── App.tsx                   # 主應用元件
└── main.tsx                  # 應用入口
```

## 🎨 核心功能

### 賽博龐克視覺系統
- **數據流動畫**: 8 條垂直流動的餐廳名稱
- **故障藝術**: 滑鼠碰觸觸發粒子爆炸效果
- **掃描線效果**: 解碼過程中的動態掃描線
- **霓虹色調**: 粉紫、青綠、黃色霓虹配色

### 智能抽籤系統
- **狀態管理**: IDLE → DECODING → DECODED 狀態機
- **隨機演算法**: 從 12 家餐廳中隨機選擇
- **視覺回饋**: 2.5 秒解碼動畫 + 故障效果

### 實用功能
- **歷史記錄**: 最多保存 10 筆解碼記錄
- **Google Maps 整合**: 一鍵導航到選中餐廳
- **本地儲存**: 使用 localStorage 持久化資料
- **響應式設計**: 完整支援桌面和行動裝置

## 🚀 開發與運行

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview

# 程式碼檢查
npm run lint
```

## 🎮 互動方式

- **點擊螢幕任何位置** 或 **點擊底部按鈕** 開始解碼
- **滑鼠移動到數據流** 觸發故障效果
- **空白鍵** 快速啟動解碼
- **R 鍵** 重置數據流
- **H 鍵** 切換歷史面板 (計劃功能)

## 📊 狀態管理

使用 Zustand 進行全域狀態管理：

```typescript
interface AppState {
  systemState: 'IDLE' | 'DECODING' | 'DECODED';
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  history: DecodeHistory[];
  showHistory: boolean;
  showOverlay: boolean;
}
```

## 🎨 設計系統

### 色彩配色
```css
--cyber-bg: #0a0a0a
--cyber-primary: #ffffff  
--cyber-neon-pink: #ff00ff
--cyber-neon-cyan: #00ffff
--cyber-neon-green: #00ff7f
--cyber-neon-yellow: #ffff00
```

### 字體系統
- **中文內容**: Noto Serif TC (思源宋體)
- **程式碼/數據**: JetBrains Mono

## 🔄 版本歷程

- **v1.0**: 純 p5.js 原型
- **v2.0**: React + TypeScript 架構重構
- **v2.1**: 計劃加入更多互動功能

## 📱 未來計劃

- [ ] PWA 支援 (離線使用)
- [ ] 真實餐廳資料整合
- [ ] 使用者偏好學習
- [ ] 社群評分系統
- [ ] 多語言支援

---

**NTUT 食慾編碼** - 讓選擇困難成為一種藝術 🎨✨