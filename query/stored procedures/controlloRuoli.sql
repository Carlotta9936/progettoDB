DELIMITER $$
USE `confvirtual`$$
CREATE PROCEDURE `controlloRuoli`(name varchar(30))
BEGIN
	select ruolo
	from ruoli
    where username=name;
END$$