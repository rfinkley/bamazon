-- ### Challenge #1: Customer View (Minimum Requirement)

-- 1. Create a MySQL Database called `bamazon`.
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

-- 2. Then create a Table inside of that database called `products`.
USE bamazon;

-- 3. The products table should have each of the following columns:

--    * item_id (unique id for each product)

--    * product_name (Name of product)

--    * department_name

--    * price (cost to customer)

--    * stock_quantity (how much of the product is available in stores)

CREATE TABLE products (
    item_id int not null unique,
    product_name varchar(255) not null,
    department_name varchar(255) not null,
    price decimal(6,2) not null,
    stock_quantity int not null,
    primary key (item_id)
);

-- 4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES 
    (1,'Web Programming For Dummies','Books',22.99,10),
    (2,'Zen and the Art of Motorcycle Maintenance: An Inquiry Into Values','Books',15.29,6),
    (3,'LG 55UM7300PUA Alexa Built-in 55','Television',399.99,4),
    (4,'Sony XBR65X900F 65-Inch 4K Ultra HD Smart LED TV','Television',1098,8),
    (5,'Blue Buffalo Life Protection Formula Natural Adult Dry Dog Food','Pet Food',49.98,4),
    (6,'Merrick Classic Healthy Grains','Pet Food',34.99,7),
    (7,'Fruit of the Loom Womens Built-Up Sports Bra Pack of 3','Clothing', 15.99, 25),
    (8,'Spalding Womens Bootleg Yoga Pant','Clothing',17.99,15),
    (9,'Cards Against Humanity','Toys',25,4),
    (10,'Ravensburger Disney Villainous: Perfectly Wretched Strategy Board Game','Toys',24.99,7);