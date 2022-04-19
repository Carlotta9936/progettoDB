DELIMITER $$
USE `confvirtual`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getPresentazioni`(numSessione int)
BEGIN
	select presentazione.ora_i as oraInizio, presentazione.ora_f as oraFine
	from sessione, presentazione
	where id_sessione = sessione and sessione = numSessione;
    
END$$