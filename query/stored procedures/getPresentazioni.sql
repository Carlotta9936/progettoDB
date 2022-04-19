DELIMITER $$
CREATE  PROCEDURE `getPresentazioni`(numSessione int)
BEGIN
	select presentazione.ora_i as oraInizio, presentazione.ora_f as oraFine
	from sessione, presentazione
	where id_sessione = sessione and sessione = numSessione;
    
END$$