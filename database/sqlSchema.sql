
CREATE TABLE user(
	`id` VARCHAR(10) NOT NULL,
	`username` VARCHAR(10) NOT NULL ,
	`password` VARCHAR(15) NOT NULL ,
	`name` VARCHAR(30) NOT NULL ,
	`mobile` VARCHAR(10) NOT NULL ,
	`email` VARCHAR(30) NOT NULL ,
	`type` VARCHAR(8) NOT NULL ,
	PRIMARY KEY (`id`)
	);

CREATE TABLE book( 
	`isbn` VARCHAR(15) NOT NULL,
	`name` VARCHAR(30) ,
	`author` VARCHAR(20) ,
	`description` VARCHAR(100) ,
	`count` INT(5) ,
	PRIMARY KEY(`isbn`)

);
CREATE TABLE borrowed(
	`uid` VARCHAR(10) NOT NULL,
	`bid` VARCHAR(15) NOT NULL ,
	PRIMARY KEY (`uid` , `bid`),
	FOREIGN KEY (`uid`) references user(`id`),
	FOREIGN KEY (`bid`) references book(`isbn`)
); 
CREATE TABLE checkout(
	`uid` VARCHAR(10) NOT NULL,
	`bid` VARCHAR(15) NOT NULL,
	PRIMARY KEY (`uid` , `bid`),
	FOREIGN KEY (`uid`) references user(`id`),
	FOREIGN KEY (`bid`) references book(`isbn`)
);
