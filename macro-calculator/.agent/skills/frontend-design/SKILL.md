---
name: nutrition-frontend-design
description: 專為「營養計算機」網站設計的前端開發規範。當使用者要求建立介面時，必須嚴格遵守此視覺與程式碼標準。
---

# 營養計算機 - 視覺設計與開發規範

這不僅僅是一個計算機，這是一個讓使用者感到「被支持」與「健康」的空間。拒絕產生那種「廉價、像是預設模板」的 AI 網頁。

## 1. 核心設計哲學 (Design Philosophy)
* **風格關鍵字**: Organic (有機的), Trustworthy (值得信賴的), Clean (乾淨的)。
* **視覺感受**: 介面應該像新鮮的蔬果一樣清爽，像醫療儀器一樣精準。
* **拒絕平庸**: 絕對不要使用純黑色 (#000000) 或純白色 (#FFFFFF)。使用帶有溫度的深灰或米白。

## 2. 色彩計畫 (Color System)
請使用 CSS Variables 定義顏色，保持一致性：
* **--primary-green**: `#4CAF50` (像新鮮菠菜的綠，用於主要按鈕、成功訊息)
* **--accent-orange**: `#FF9800` (像胡蘿蔔的活力橘，用於強調數字、CTA 按鈕)
* **--bg-cream**: `#FAFAFA` (背景底色，米白色)
* **--text-dark**: `#2D3748` (主要文字，深灰藍色，比純黑更易讀)
* **--text-light**: `#718096` (次要文字)

## 3. 排版與字體 (Typography)
* 不要使用 Arial 或 Times New Roman。
* **推薦字體**: 使用 Google Fonts 的 `Nunito` (圓潤友善，適合標題) 搭配 `Lato` (乾淨易讀，適合內文)。
* **數字呈現**: 所有的數據（如 TDEE、體重）必須使用 **特大號字體** 並加粗，讓使用者一眼就看到結果。

## 4. UI 元件規範 (Component Rules)
* **卡片 (Cards)**: 所有內容區塊都要放在「卡片」裡。卡片要有 `border-radius: 16px` (圓角大一點比較親切) 和輕微的 `box-shadow`。
* **輸入框 (Inputs)**: 高度至少 `48px` (為了讓手機好點擊)。輸入時要有明顯的綠色邊框 `focus` 效果。
* **按鈕 (Buttons)**: 禁止使用直角按鈕。按鈕必須有 `hover` (滑鼠懸停) 和 `active` (點擊下壓) 的微動畫效果。

## 5. 互動與動效 (Motion)
* **拒絕死板**: 頁面載入時，不要一次全部出現。讓卡片從下方輕輕滑入 (Fade in up)。
* **數據跑分**: 當顯示計算結果時，數字不要直接跳出來，要有一個從 0 開始跑到結果的「跑分動畫」(Number counting animation)。

## 6. 程式碼品質 (Code Quality)
* 使用 React Functional Components。
* 使用 Tailwind CSS 進行樣式設定（如果專案支援）。
* **RWD 優先**: 永遠優先考慮「手機版」的顯示效果。