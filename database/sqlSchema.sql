
CREATE TABLE user (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(10) NOT NULL ,
	`name` INT(30) NOT NULL ,
	`mobile` INT(10) NOT NULL ,
	`email` VARCHAR(30) NOT NULL ,
	`type` VARCHAR(8) NOT NULL ,
	PRIMARY KEY (`id`)
	);

CREATE TABLE book(
	`id` INT NOT NULL  AUTO_INCREMENT,
	`name` VARCHAR(30) ,
	`author` VARCHAR(20),
	PRIMARY KEY(`id`)

);
CREATE TABLE borrowed(
	`uid` INT ,
	bid INT ,
	PRIMARY KEY (`uid` , `bid`),
	FOREIGN KEY (`uid`) references user(`id`),
	FOREIGN KEY (`bid`) references book(`id`)
); 
CREATE TABLE checkout(
	`uid` INT,
	`bid` INT,
	PRIMARY KEY (`uid` , `bid`),
	FOREIGN KEY (`uid`) references user(`id`),
	FOREIGN KEY (`bid`) references book(`id`)
);
