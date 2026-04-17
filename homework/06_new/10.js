function calculateTotal(cart, discountFunc) {
  const total = cart.reduce((sum, price) => sum + price, 0);
  return discountFunc(total);
}

// 測試
const result = calculateTotal([100, 200, 300], total => total - 50);

console.log(result);