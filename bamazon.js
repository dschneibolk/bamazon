var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "fuckrun3sc4p3",
  database: "bamazon_db"
});
start();
// Start Function
function start() {
  connection.query('SELECT * FROM Products', function(err, res){

      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + res[i].product_name + ' | Price: ' + res[i].price + ' | Quantity: ' + res[i].quantity);
      }
      
      inquirer.prompt([{
          name: "choice",
          type: "rawlist",
          message: "What would you like to purchase?",
          choices: function(value) {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                  choiceArray.push(res[i].product_name);
              }
              return choiceArray;
          }
      }, {

          name: "quantity",
          type: "input",
          message: "How many would you like to purchase?",
          validate: function(value) {
              if (isNaN(value) == false) {
                  return true;
              } else {
                  return false;
              }
          }
      }]).then(function(response) {
          for (var i = 0; i < res.length; i++) {
              if (res[i].product_name == response.choice) {
                  var chosenItem = res[i];
              }
          }

        var updateQuant= parseInt(chosenItem.quantity) - parseInt(response.quantity);

          if (chosenItem.quantity < parseInt(response.quantity)) {
              console.log("Insufficient quantity!");

              repurchase();
          } else {
              connection.query("UPDATE products SET ? WHERE ?", [{quantity: updateQuant}, {item_id: chosenItem.item_id}], function(err, res) {
                  console.log("Purchase successful!");

                  var Total = (parseInt(response.quantity)*chosenItem.price).toFixed(2);
                  console.log("Your total is $" + Total);
              });
          }

      }); 
                       
  }); 
  
}
