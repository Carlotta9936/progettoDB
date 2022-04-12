DELIMITER $$
USE `confvirtual`$$
CREATE PROCEDURE `visualizza presentazione` (in newsessione int)
BEGIN
	select *
    from presentazione
    where sessione=newsessione;
END$$