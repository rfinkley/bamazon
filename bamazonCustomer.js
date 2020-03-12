const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const mysql = require("mysql");
const cTable = require('console.table');

// Create connection mysql database
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

//Use figlet and chalk to create a screen title
clear();
console.log(
    chalk.yellowBright(
        figlet.textSync('BAM!AZON', {
            horizontalLayout: "full"
        })
    )
);

// Create a function to display all items in products table
function allItems() {
    connection.query('SELECT * FROM products', function (error, results) {
        if (error) throw error;
        console.log('\n');
        console.log(chalk.blue.bgBlack.bold('Check out the goods!'));
        const table = cTable.getTable(results);
        console.log(table);
    });
}

// Create start function with user options
function start() {
    inquirer
        .prompt({
            name: "option",
            type: "list",
            message: "What would you like to do?",
            choices: ["ORDER", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.option === "ORDER") {
                order();
            } else {
                connection.end();
            }
        });
}


// Create function that allows user to place an order
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
    inquirer.prompt(questions).then(answers => {
        connection
            .query('SELECT * FROM products WHERE item_id = ?', [answers.productID], function (error, res) {
                if (error) throw error;
                let stock = res[0].stock_quantity;
                if (stock < answers.qty) {
                    console.log(chalk.redBright('Insufficent Stock'));
                    allItems();
                    connection.end();
                } else {
                    stockUpdate = stock - answers.qty;
                    console.log('Order Details:');
                    let order = {
                        prdName: res[0].product_name,
                        price: res[0].price,
                        qtyOrdered: answers.qty,
                        total: answers.qty * res[0].price
                    };
                    console.log("Order Placed");
                    console.log('Product: ' + order.prdName);
                    console.log('Price: ' + order.price);
                    console.log('Quantity: ' + answers.qty);
                    console.log('Total: $' + order.total);
                    connection.query('UPDATE products SET ? WHERE ?', [{
                            stock_quantity: stockUpdate
                        },
                        {
                            item_id: answers.productID
                        }
                    ], function (err) {
                        if (err) throw err;
                        allItems();
                        connection.end();
                    });
                }
            });
    });
}

// Open connection and call start function
connection.connect(function (err) {
    if (err) throw err;
    start();
});