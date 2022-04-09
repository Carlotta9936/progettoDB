DELIMITER $$

CREATE  PROCEDURE `selezionapresentazione`()
BEGIN
	select max(presentazione.id_presentazione)as id
	from presentazione;
    
 
END$$

DELIMITER ;