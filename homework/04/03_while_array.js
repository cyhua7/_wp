const nums = [3, 7, 2, 9, 5];
let index = 0;

while (index < nums.length) {
  if (nums[index] > 8) {
    console.log(`找到數字 ${nums[index]} 在索引 ${index}`);
    break; // 找到後跳出迴圈
  }
  index++;
}