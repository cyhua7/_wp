const jsonList = '[{"name": "書", "price": 200}, {"name": "筆", "price": 30}]';
const items = JSON.parse(jsonList);
let total = 0;

for (let item of items) {
  total += item.price;
}
console.log(`總金額為: ${total}`); // 輸出: 230