DELIMITER $$

CREATE  PROCEDURE `selectprogramma`( anno int, acronimo varchar(10))
BEGIN
	SELECT * 
    FROM programma_giornaliero 
    WHERE programma_giornaliero.anno=anno and programma_giornaliero.acronimo= acronimo;
    
END$$

DELIMITER ;