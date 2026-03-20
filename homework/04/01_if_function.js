function checkScore(score) {
  if (score < 0 || score > 100) {
    return "錯誤輸入";
  } else if (score >= 90) {
    return "A";
  } else if (score >= 80) {
    return "B";
  } else if (score >= 70) {
    return "C";
  } else {
    return "F";
  }
}
console.log(checkScore(85)); // 輸出: B