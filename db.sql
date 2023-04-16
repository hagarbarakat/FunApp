CREATE DATABASE funApp; 

CREATE TABLE user(
    id  INT     PRIMARY KEY     NOT NULL,
    name VARCHAR ( 50 )    NOT NULL,
    email VARCHAR (255)   UNIQUE NOT NULL,
    city  VARCHAR ( 50 )   NOT NULL,
    state VARCHAR ( 50 )   NOT NULL
)

INSERT INTO User(name, email, city, state) VALUES ("hagar", "hagarbarakat@gmail.com", "Westfield", "Massachusetts"),
("ahmed", "ahmed1234@gmail.com", "Westfield", "Massachusetts");