var faker = require('faker');
console.log('======================');
console.log("WELOCME TO MY SHOP");
console.log('======================');
for(var i=0;i<10;i++)
{
    var randProd = faker.commerce.productName();
    var randPric = faker.commerce.price();
    var randCurr = faker.finance.currencySymbol();
    console.log(randProd + " - "+ randCurr+ " " + randPric);    
}
