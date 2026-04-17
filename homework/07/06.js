const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';

// JSON 轉成 JS 物件
let obj = JSON.parse(jsonStr);

// 印出 tags 陣列的第二個元素
console.log(obj.tags[1]);