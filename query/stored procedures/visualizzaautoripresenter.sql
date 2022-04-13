DELIMITER $$

CREATE PROCEDURE `visualizzaautoripresenter` ()
BEGIN
	select * from autore where id_autore>=1000;
END$$