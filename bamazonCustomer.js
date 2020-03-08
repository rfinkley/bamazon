// 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.


// * If this activity took you between 8-10 hours, then you've put enough time into this assignment. Feel free to stop here -- unless you want to take on the next challenge.

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inq = require('inquirer');
const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "rob",

    // Your password
    password: "password",
    database: "bamazon"
});

clear();
console.log(
    chalk.yellowBright(
        figlet.textSync('BAM!AZON', {
            horizontalLayout: "full"
        })
    )
);

function allItems() {
    connection.query('SELECT * FROM products', function (error, results) {
        if (error) throw error;
        console.log('\n');
        console.log(chalk.blue.bgBlack.bold('Check out the goods!'));
        console.table(results);
        connection.end();
        });
    }

function order() {
    var questions = [{
            type: 'number',
            name: 'productID',
            message: "What's the product ID?"
        },
        {
            type: 'number',
            name: 'qty',
            message: "How many do you want?",
        }
    ];
    inq.prompt(questions).then(answers => {
        connection
            .query('SELECT * FROM products WHERE item_id = ?', [answers.productID], function (error, res) {
                if (error) throw error;
                let stock = res[0].stock_quantity;
                if (stock < answers.qty) {
                    console.log(chalk.redBright('Insufficent Stock'));
                    allItems();
                } else {
                    stockUpdate = stock - answers.qty;
                    connection.query('UPDATE products SET ? WHERE ?', [{
                        stock_quantity: stockUpdate
                    },
                    {
                        item_id: answers.productID
                    }
                ], function (err, res) {
                    if (err) throw err;
                    console.log("Order Placed");
                    allItems();
                });
                return stock;
                }
            });
    });
}

connection.connect(function (err) {
    if (err) throw err;
    order();
});