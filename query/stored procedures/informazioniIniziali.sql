DELIMITER $$
CREATE PROCEDURE `informazioniIniziali`()
BEGIN
	SELECT count(*) as numUtenti FROM utente; 
	SELECT count(*) as numConferenze FROM conferenza;
	SELECT count(*) as numConferenzeAttive FROM conferenza WHERE svolgimento = "Attiva";
END$$
DELIMITER ;