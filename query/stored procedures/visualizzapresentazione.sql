DELIMITER $$

CREATE  PROCEDURE `visualizzapresentazione`(in newsessione int)
BEGIN
	select *
    from presentazione
    where sessione=newsessione;
    
END$$