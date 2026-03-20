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