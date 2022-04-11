DELIMITER $$
CREATE PROCEDURE `informazioniIniziali`()
BEGIN
	SELECT count(*) as numUtenti FROM utente; 
	SELECT count(*) as numConferenze FROM conferenza;
END$$
DELIMITER ;