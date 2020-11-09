--1 command: connect uuid extention
CREATE EXTENSION IF NOT EXISTS 'uuid-ossp';

--2 command: create product table:
--    products:
--    id -  uuid (primary key)
--    title - text, not null
--    description - text
--    price - integer
create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer	
);

drop table products

--3 command: create stocks table:
--stocks:
--    product_id - uuid (foreign key from products.id)
--    count - integer (There are no more products than this count in stock)
create table stocks (
	product_id uuid primary KEY,
	count integer,
	foreign key (product_id) references products(id)
)

drop table stocks 

--4 command fill 'products' table with test data
insert into products (id, title, description, price) values
--    {
--        'count': 4,
--        'description': 'Short Product Description1',
--        'id': '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
--        'price': 2.4,
--        'title': 'ProductOne'
--    },
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 'ProductOne', 'Short Product Description1', 240 ),
--    {
--        'count': 6,
--        'description': 'Short Product Description3',
--        'id': '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
--        'price': 10,
--        'title': 'ProductNew'
--    },
('7567ec4b-b10c-48c5-9345-fc73c48a80a0','ProductNew', 'Short Product Description3', 1000 ),
--    {
--        'count': 7,
--        'description': 'Short Product Description2',
--        'id': '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
--        'price': 23,
--        'title': 'ProductTop'
--    },
('7567ec4b-b10c-48c5-9345-fc73c48a80a3','ProductTop', 'Short Product Description2', 2300 ),
--    {
--        'count': 12,
--        'description': 'Short Product Description7',
--        'id': '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
--        'price': 15,
--        'title': 'ProductTitle'
--    },
('7567ec4b-b10c-48c5-9345-fc73c48a80a1','ProductTitle', 'Short Product Description7', 1500 ),
--    {
--        'count': 7,
--        'description': 'Short Product Description2',
--        'id': '7567ec4b-b10c-48c5-9345-fc73c48a80a2',
--        'price': 23,
--        'title': 'Product'
--    },
('7567ec4b-b10c-48c5-9345-fc73c48a80a2','Product', 'Short Product Description2', 2300 ),
--    {
--        'count': 8,
--        'description': 'Short Product Description4',
--        'id': '7567ec4b-b10c-48c5-9345-fc73348a80a4',
--        'price': 15,
--        'title': 'Product'
--    },
('7567ec4b-b10c-48c5-9345-fc73c48a80a4','Product', 'Short Product Description4', 1500 ),
--    {
--        'count': 2,
--        'description': 'Short Product Descriptio1',
--        'id': '7567ec4b-b10c-48c5-9445-fc73c48a80a5',
--        'price': 28,
--        'title': 'Product2'
--    },
('7567ec4b-b10c-48c5-9345-fc73c48a80a5','Product2', 'Short Product Description1', 2800 ),
--    {
--        'count': 3,
--        'description': 'Short Product Description7',
--        'id': '7567ec4b-b10c-45c5-9345-fc73c48a80a6',
--        'price': 19,
--        'title': 'ProductName'
--    }
('7567ec4b-b10c-48c5-9345-fc73c48a80a6','ProductName', 'Short Product Description7', 1900 )

-- Fill stoks table with test data
insert into stocks (product_id, count) values
--('4338c386-5d4c-4718-82ab-bf1054ae6f43', 33 )
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 4 ),
('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 6 ),
('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 7 ),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 12 ),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 7 ),
('7567ec4b-b10c-48c5-9345-fc73c48a80a4', 8 ),
('7567ec4b-b10c-48c5-9345-fc73c48a80a5', 2 ),
('7567ec4b-b10c-48c5-9345-fc73c48a80a6', 3 )


-- Query - retrieving all products 
select p.id, p.description, p.price, p.title, s.count from products p left join stoks s on p.id=s.product_id

-- Query - retrieving product by id 
select p.id, p.description, p.price, p.title, s.count from products p left join stoks s on p.id = s.product_id where s.product_id = '7567ec4b-b10c-48c5-9345-fc73c48a80aa' and p.id = '7567ec4b-b10c-48c5-9345-fc73c48a80aa'