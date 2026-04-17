function checkAdmin(role, callback) {
  if (role !== "admin") {
    callback("Access Denied");
    return;
  }

  callback(null, "Welcome");
}

// 測試 1：不是 admin（會錯誤）
checkAdmin("user", (err, message) => {
  if (err) {
    console.log("錯誤：", err);
  } else {
    console.log("成功：", message);
  }
});

// 測試 2：是 admin（成功）
checkAdmin("admin", (err, message) => {
  if (err) {
    console.log("錯誤：", err);
  } else {
    console.log("成功：", message);
  }
});