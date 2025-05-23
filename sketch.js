let video;
let facemesh;
let predictions = [];
const indices = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];
const indices2 = [76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });
}

function modelReady() {
  // 模型載入完成，可選擇顯示訊息
}

function draw() {
  // 鏡頭反轉
  translate(width, 0);
  scale(-1, 1);

  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 先畫第一組紅色線（嘴巴閉合）
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 再畫第二組紅色線並填滿黃色
    stroke(255, 0, 0);
    strokeWeight(2);
    fill(255, 255, 0, 200); // 半透明黃色
    beginShape();
    for (let i = 0; i < indices2.length; i++) {
      const idx = indices2[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 在第一組與第二組之間充滿綠色
    fill(0, 255, 0, 150); // 半透明綠色
    noStroke();
    beginShape();
    // 先畫第一組
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    // 再畫第二組（反向，避免交錯）
    for (let i = indices2.length - 1; i >= 0; i--) {
      const idx = indices2[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 畫左眼綠色線條
    const leftEyeIndices = [243,190,56,28,27,29,30,247,130,25,110,24,23,22,26,112];
    stroke(0, 255, 0); // 綠色
    strokeWeight(2);
    noFill();
    for (let i = 0; i < leftEyeIndices.length - 1; i++) {
      const idx1 = leftEyeIndices[i];
      const idx2 = leftEyeIndices[i + 1];
      const [x1, y1] = keypoints[idx1];
      const [x2, y2] = keypoints[idx2];
      line(x1, y1, x2, y2);
    }
    // 收尾連回起點
    const [xStart, yStart] = keypoints[leftEyeIndices[0]];
    const [xEnd, yEnd] = keypoints[leftEyeIndices[leftEyeIndices.length - 1]];
    line(xEnd, yEnd, xStart, yStart);

    // 左眼紅色填滿
    noStroke();
    fill(255, 0, 0, 180); // 半透明紅色
    beginShape();
    for (let i = 0; i < leftEyeIndices.length; i++) {
      const idx = leftEyeIndices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // 畫右眼綠色線條
    const rightEyeIndices = [263,466,388,387,386,385,384,398,362,382,381,380,374,373,390,249];
    stroke(0, 255, 0); // 綠色
    strokeWeight(2);
    noFill();
    for (let i = 0; i < rightEyeIndices.length - 1; i++) {
      const idx1 = rightEyeIndices[i];
      const idx2 = rightEyeIndices[i + 1];
      const [x1, y1] = keypoints[idx1];
      const [x2, y2] = keypoints[idx2];
      line(x1, y1, x2, y2);
    }
    // 收尾連回起點
    const [rxStart, ryStart] = keypoints[rightEyeIndices[0]];
    const [rxEnd, ryEnd] = keypoints[rightEyeIndices[rightEyeIndices.length - 1]];
    line(rxEnd, ryEnd, rxStart, ryStart);

    // 右眼紅色填滿
    noStroke();
    fill(255, 0, 0, 180); // 半透明紅色
    beginShape();
    for (let i = 0; i < rightEyeIndices.length; i++) {
      const idx = rightEyeIndices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
