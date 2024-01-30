CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email TEXT UNIQUE,
	password TEXT,
	cpf BIGINT UNIQUE
);

CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(id),
	date TIMESTAMP
);

CREATE TABLE store (
	id SERIAL PRIMARY KEY,
	name TEXT,
	cnpj BIGINT UNIQUE
);

CREATE TABLE menus (
	id SERIAL PRIMARY KEY,
	store_id INT REFERENCES store(id)
);

CREATE TABLE items (
	id SERIAL PRIMARY KEY,
	name TEXT,
	price FLOAT,
	menu_id INT REFERENCES menus(id)
);

CREATE TABLE orders_items (
	item_id INT REFERENCES items(id),
	order_id INT REFERENCES orders(id)
);

ALTER TABLE store ADD COLUMN password TEXT;
ALTER TABLE menus ADD COLUMN name TEXT;

CREATE TABLE deliveryman (
	id SERIAL PRIMARY KEY,
	email TEXT,
	password TEXT,
	cpf BIGINT
);

CREATE TABLE order_status (
	id SERIAL PRIMARY KEY,
	name TEXT
);

INSERT INTO order_status (name) 
VALUES ('PREPARING'),
	   ('WAITING_FOR_DELIVERYMAN'),
	   ('OUT_FOR_DELIVERY'),
	   ('FINISHED');

ALTER TABLE orders ADD COLUMN status INT REFERENCES order_status(id);

ALTER TABLE deliveryman RENAME TO deliverymans;
ALTER TABLE store RENAME TO stores;

ALTER TABLE deliverymans ADD UNIQUE (email);
ALTER TABLE deliverymans ADD UNIQUE (cpf);

ALTER TABLE orders ADD COLUMN store_id INT REFERENCES stores(id);
ALTER TABLE orders ADD COLUMN deliveryman_id INT REFERENCES deliverymans(id);