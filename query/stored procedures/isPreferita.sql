DELIMITER $$
CREATE PROCEDURE `isPreferita` (in user varchar(30), in id int)
BEGIN
	select *
    from preferiti
    where preferiti_username=user and preferiti_presentazione=id;
END$$