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