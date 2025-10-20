// 2つの独立したキャンバスを作成（シンプルなアプローチ）
let staticCanvas, animatedCanvas;
let canvasCreated = false;
let staticFaceParams = null; // 右側の顔のパラメータ

// 右側の顔のアニメーション用変数
let rightAnimationActive = false;
let rightAnimationStartTime = null;
let rightAnimationDuration = 1000; // デフォルト1秒
let rightStartParams = {};
let rightTargetParams = {};
let rightCurrentParams = {};

function setup() {
  // メインキャンバスを非表示で作成
  let mainCanvas = createCanvas(1, 1);
  mainCanvas.hide();
  
  // 静的な顔のキャンバス（上部）
  staticCanvas = createGraphics(540, 360);
  
  // アニメーション顔のキャンバス（下部）
  animatedCanvas = createGraphics(540, 360);

  // UIイベントリスナーの設定
  setupUIListeners();
  
  // 右側の顔の初期パラメータを設定（デフォルト値）
  rightCurrentParams = {
    eyeOpenness: 1,
    pupilSize: 0.7,
    pupilAngle: 0,
    upperEyelidAngle: 0,
    upperEyelidCoverage: 0,
    lowerEyelidCoverage: 0,
    mouthCurve: 0,
    mouthHeight: 0,
    mouthWidth: 1
  };
  
  // キャンバスをDOMに追加
  setTimeout(() => {
    // アニメーションキャンバスを左側に配置
    let animatedHolder = document.getElementById('animated-canvas-holder');
    animatedHolder.appendChild(animatedCanvas.canvas);
    
    // 静的キャンバスを右側に配置
    let staticHolder = document.getElementById('static-canvas-holder');
    staticHolder.appendChild(staticCanvas.canvas);
    
    canvasCreated = true;
  }, 100);
}

function draw() {
  if (!canvasCreated) return;
  
  // 静的な顔を描画（上部キャンバス）
  drawStaticFace();
  
  // アニメーション顔を描画（下部キャンバス）
  drawAnimatedFace();
}

// 静的な顔を描画
function drawStaticFace() {
  staticCanvas.background(255, 235, 250);
  staticCanvas.push();
  staticCanvas.translate(staticCanvas.width / 2, staticCanvas.height / 2);
  
  // 右側のアニメーションを更新
  if (rightAnimationActive) {
    updateRightAnimation();
  }
  
  // デフォルトのパラメータを一時的に保存
  const savedParams = { ...faceParams };
  
  // 右側の現在のパラメータを使用
  Object.assign(faceParams, rightCurrentParams);
  
  // 描画コンテキストを静的キャンバスに設定
  let originalCtx = setupContext(staticCanvas);
  
  // 既存の関数を使って描画
  drawEyes();
  drawMouth();
  
  // コンテキストを復元
  restoreContext(originalCtx);
  
  // パラメータを元に戻す
  Object.assign(faceParams, savedParams);
  
  staticCanvas.pop();
}

// 右側のアニメーション更新
function updateRightAnimation() {
  const currentTime = millis();
  const elapsed = currentTime - rightAnimationStartTime;
  const progress = Math.min(elapsed / rightAnimationDuration, 1);
  
  // イージング関数（ease-in-out）
  const easeProgress = progress < 0.5 
    ? 2 * progress * progress 
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  
  // 各パラメータを補間
  for (let key in rightTargetParams) {
    if (rightStartParams[key] !== undefined) {
      rightCurrentParams[key] = lerp(rightStartParams[key], rightTargetParams[key], easeProgress);
    }
  }
  
  // アニメーション終了判定
  if (progress >= 1) {
    rightAnimationActive = false;
  }
}

// 実行ボタンの処理
function executeAction() {
  // アニメーション速度を取得
  const speedValue = parseFloat(document.getElementById("animationSpeed").value);
  rightAnimationDuration = speedValue * 1000; // 秒をミリ秒に変換
  
  // 現在の右側のパラメータを開始値として保存
  rightStartParams = { ...rightCurrentParams };
  
  // 左側のパラメータを目標値として設定
  rightTargetParams = { ...faceParams };
  
  // アニメーション開始
  rightAnimationStartTime = millis();
  rightAnimationActive = true;
}

// リセットボタンの処理
function resetAction() {
  // アニメーションを停止
  rightAnimationActive = false;
  
  // デフォルトパラメータに即座に戻す
  rightCurrentParams = {
    eyeOpenness: 1,
    pupilSize: 0.7,
    pupilAngle: 0,
    upperEyelidAngle: 0,
    upperEyelidCoverage: 0,
    lowerEyelidCoverage: 0,
    mouthCurve: 0,
    mouthHeight: 0,
    mouthWidth: 1
  };
}

// アニメーション顔を描画
function drawAnimatedFace() {
  animatedCanvas.background(255, 235, 250);
  animatedCanvas.push();
  animatedCanvas.translate(animatedCanvas.width / 2, animatedCanvas.height / 2);
  
  // アニメーションを更新
  updateAnimation();
  
  // 描画コンテキストをアニメーションキャンバスに設定
  let originalCtx = setupContext(animatedCanvas);
  
  // 目を描画
  drawEyes();
  
  // 口を描画
  drawMouth();
  
  // コンテキストを復元
  restoreContext(originalCtx);
  
  animatedCanvas.pop();
}

// コンテキストを設定
function setupContext(canvas) {
  const original = {
    push: window.push,
    pop: window.pop,
    translate: window.translate,
    fill: window.fill,
    stroke: window.stroke,
    strokeWeight: window.strokeWeight,
    ellipse: window.ellipse,
    arc: window.arc,
    rotate: window.rotate,
    radians: window.radians,
    rect: window.rect,
    line: window.line,
    noFill: window.noFill,
    noStroke: window.noStroke,
    beginShape: window.beginShape,
    vertex: window.vertex,
    endShape: window.endShape,
    curveVertex: window.curveVertex,
    width: window.width,
    height: window.height,
    drawingContext: window.drawingContext,
    abs: window.abs,
    asin: window.asin,
    cos: window.cos,
    sin: window.sin,
    PI: window.PI,
    TWO_PI: window.TWO_PI,
    CLOSE: window.CLOSE
  };
  
  // キャンバスの関数に置き換え
  window.push = () => canvas.push();
  window.pop = () => canvas.pop();
  window.translate = (x, y) => canvas.translate(x, y);
  window.fill = (...args) => canvas.fill(...args);
  window.stroke = (...args) => canvas.stroke(...args);
  window.strokeWeight = (w) => canvas.strokeWeight(w);
  window.ellipse = (x, y, w, h) => canvas.ellipse(x, y, w, h);
  window.arc = (x, y, w, h, start, stop, mode) => canvas.arc(x, y, w, h, start, stop, mode);
  window.rotate = (angle) => canvas.rotate(angle);
  window.radians = (degrees) => canvas.radians(degrees);
  window.rect = (x, y, w, h) => canvas.rect(x, y, w, h);
  window.line = (x1, y1, x2, y2) => canvas.line(x1, y1, x2, y2);
  window.noFill = () => canvas.noFill();
  window.noStroke = () => canvas.noStroke();
  window.beginShape = () => canvas.beginShape();
  window.vertex = (x, y) => canvas.vertex(x, y);
  window.endShape = (mode) => canvas.endShape(mode);
  window.curveVertex = (x, y) => canvas.curveVertex(x, y);
  window.width = canvas.width;
  window.height = canvas.height;
  window.drawingContext = canvas.canvas.getContext('2d');
  
  return original;
}

// コンテキストを復元
function restoreContext(original) {
  Object.keys(original).forEach(key => {
    window[key] = original[key];
  });
}