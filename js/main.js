// メインのp5.js設定

function setup() {
  let canvas = createCanvas(540, 360);
  canvas.parent("canvas-container");

  // UIイベントリスナーの設定
  setupUIListeners();
}

function draw() {
  background(255, 235, 250); // 薄いピンク色の背景

  // アニメーションを更新
  updateAnimation();

  push();
  translate(width / 2, height / 2);

  // 顔の輪郭は描かない（添付画像に合わせて）

  // 目を描画
  drawEyes();

  // 口を描画
  drawMouth();

  pop();
}