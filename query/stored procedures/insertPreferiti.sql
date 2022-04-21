DELIMITER $$
CREATE PROCEDURE `insertPreferiti` (in id int,in user varchar(30))
BEGIN
	insert into preferiti (preferiti_presentazione, preferiti_username) values (id, user);
END$$