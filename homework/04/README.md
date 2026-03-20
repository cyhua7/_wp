## 習題 4

AI問答 -- https://gemini.google.com/share/1bfabe2af49b

## 我的測試結果
....
PS C:\cyh\_wp\homework\04> node 01_if_function.js
B
....
PS C:\cyh\_wp\homework\04> node 02_for_function.js
55
....
PS C:\cyh\_wp\homework\04> node 03_while_array.js
找到數字 9 在索引 3
....
PS C:\cyh\_wp\homework\04> node 04_object.js
{ name: '小明', age: 20, city: '台北', isStudent: true }
....
PS C:\cyh\_wp\homework\04> node 05_json_object.js
帳號啟用中
....
PS C:\cyh\_wp\homework\04> node 06_array_for_if.js
[ 12, 130, 44 ]
....
PS C:\cyh\_wp\homework\04> node 07_function.js
5
....
PS C:\cyh\_wp\homework\04> node 08_json.js
總金額為: 230
....

## 摘要
這是一份精心設計的 JavaScript 基礎綜合練習題，每題都結合了你要求的技術點（`if`, `for`, `while`, `function`, `json`, `array`, `object`），並附上詳細解答與邏輯說明。

---

## 📝 JavaScript 綜合練習題與解答

### 第一題：基礎邏輯與條件判斷 (`if`, `function`)
**題目：** 寫一個函式 `checkScore`，傳入一個分數（0-100）。如果分數 $\ge 90$ 回傳 "A"，$80-89$ 回傳 "B"，$70-79$ 回傳 "C"，其餘回傳 "F"。同時需判斷若分數不在 0-100 之間，回傳 "錯誤輸入"。

**解答：**
```javascript
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
```

---

### 第二題：數列加總與迴圈 (`for`, `function`)
**題目：** 寫一個函式 `sumRange(n)`，使用 `for` 迴圈計算從 1 加到 $n$ 的總和。

**解答：**
```javascript
function sumRange(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}
console.log(sumRange(10)); // 輸出: 55
```

---

### 第三題：陣列搜尋與控制 (`while`, `array`)
**題目：** 給定一個陣列 `[3, 7, 2, 9, 5]`，使用 `while` 迴圈依序檢查元素，直到找到大於 8 的數字為止，並印出該數字及其索引值。

**解答：**
```javascript
const nums = [3, 7, 2, 9, 5];
let index = 0;

while (index < nums.length) {
  if (nums[index] > 8) {
    console.log(`找到數字 ${nums[index]} 在索引 ${index}`);
    break; // 找到後跳出迴圈
  }
  index++;
}
```

---

### 第四題：物件操作與字串處理 (`object`)
**題目：** 建立一個 `user` 物件，包含屬性 `name`, `age`, `city`。請寫一段程式將 `city` 修改為 "台北"，並新增一個屬性 `isStudent` 為 `true`。

**解答：**
```javascript
let user = {
  name: "小明",
  age: 20,
  city: "金門"
};

user.city = "台北"; // 修改屬性
user.isStudent = true; // 新增屬性
console.log(user);
```

---

### 第五題：JSON 資料解析 (`json`, `object`)
**題目：** 接收一段 JSON 字串 `{"id": 101, "status": "active"}`，請將其轉換成 JavaScript 物件，並判斷若 `status` 為 "active"，則印出 "帳號啟用中"。

**解答：**
```javascript
const jsonStr = '{"id": 101, "status": "active"}';
const data = JSON.parse(jsonStr); // 字串轉物件

if (data.status === "active") {
  console.log("帳號啟用中");
}
```

---

### 第六題：陣列過濾與計算 (`array`, `for`, `if`)
**題目：** 有一個數字陣列 `[12, 5, 8, 130, 44]`，請寫一個 `for` 迴圈找出所有大於 10 的數字，並存入一個名為 `filtered` 的新陣列中。

**解答：**
```javascript
const numbers = [12, 5, 8, 130, 44];
let filtered = [];

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 10) {
    filtered.push(numbers[i]);
  }
}
console.log(filtered); // 輸出: [12, 130, 44]
```

---

### 第七題：物件陣列與函式 (`array`, `object`, `function`)
**題目：** 寫一個函式 `findProduct(items, targetName)`。`items` 是一個物件陣列，如 `[{name: 'Apple', price: 10}, {name: 'Banana', price: 5}]`。函式需回傳該產品的價格。

**解答：**
```javascript
function findProduct(items, targetName) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name === targetName) {
      return items[i].price;
    }
  }
  return "找不到產品";
}

const cart = [{name: 'Apple', price: 10}, {name: 'Banana', price: 5}];
console.log(findProduct(cart, 'Banana')); // 輸出: 5
```

---

### 第八題：綜合應用 - 購物車結帳 (`for`, `object`, `json`)
**題目：** 有一個 JSON 格式的購物清單 `[{"name": "書", "price": 200}, {"name": "筆", "price": 30}]`。請解析它並計算總金額。

**解答：**
```javascript
const jsonList = '[{"name": "書", "price": 200}, {"name": "筆", "price": 30}]';
const items = JSON.parse(jsonList);
let total = 0;

for (let item of items) {
  total += item.price;
}
console.log(`總金額為: ${total}`); // 輸出: 230
```

---

### 第九題：巢狀結構處理 (`array`, `for`)
**題目：** 有一個二維陣列 `[[1, 2], [3, 4], [5, 6]]`，請使用嵌套 `for` 迴圈計算所有數字的總和。

**解答：**
```javascript
const matrix = [[1, 2], [3, 4], [5, 6]];
let sum = 0;

for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    sum += matrix[i][j];
  }
}
console.log(sum); // 輸出: 21
```

---

### 第十題：物件方法與邏輯 (`object`, `function`, `if`)
**題目：** 建立一個物件 `bankAccount`，包含屬性 `balance: 1000`。新增一個方法 `withdraw(amount)`，若餘額足夠則扣款並印出「提款成功，餘額：XX」，否則印出「餘額不足」。

**解答：**
```javascript
let bankAccount = {
  balance: 1000,
  withdraw: function(amount) {
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(`提款成功，餘額：${this.balance}`);
    } else {
      console.log("餘額不足");
    }
  }
};

bankAccount.withdraw(400); // 輸出: 提款成功，餘額：600
bankAccount.withdraw(800); // 輸出: 餘額不足
```

---

這些題目涵蓋了網頁開發中最常用的邏輯操作。你想讓我針對其中某一題，示範如何將結果顯示在 HTML 網頁上嗎？