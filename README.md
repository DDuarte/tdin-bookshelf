# tdin-bookshelf
Books sale platform

##Required software
- Node.js (https://nodejs.org/)
- npm (https://www.npmjs.com/) (included with Node) 
- Bower (http://bower.io/) (npm install bower –g)
- Sails.js (http://sailsjs.org/) (npm install sails –g)
- PostgreSQL (http://www.postgresql.org/)
- RabbitMQ (https://www.rabbitmq.com/) Store

## Store
1.	Edit store-server/config/default.json (namely database access and email account).
2.	cd store-server
3.	npm install
4.	cd public && bower install
5.	cd store-server && node server.js
6.	node server.js
7.	..
8.	Browse to http://localhost:8000
9.	Register/Login
a.	Clerk: username: clerk@bookshelf.com – password: bookshelf
b.	Customer: create an account
10.	..
11.	Profit!

##Warehouse
1.	Edit warehouse/configs/connections.js
2.	cd warehouse
3.	npm install
4.	bower install
5.	node app.js
6.	..
7.	Browse to http://localhost:1337
8.	Create an account
9.	Login
10.	..
11.	Profit!
