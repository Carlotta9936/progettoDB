DELIMITER $$

CREATE PROCEDURE `autorecreato`()
BEGIN
	
    select max(id_autore) as autore from autore;
END$$