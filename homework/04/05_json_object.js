const jsonStr = '{"id": 101, "status": "active"}';
const data = JSON.parse(jsonStr); // 字串轉物件

if (data.status === "active") {
  console.log("帳號啟用中");
}