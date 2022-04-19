DELIMITER $$
CREATE PROCEDURE `insertpresentazione`(in ora_i time(4),in  ora_f time(4),in  ordine int,in sessione int)
BEGIN
	
    INSERT INTO presentazione(ora_i, ora_f, ordine, sessione) VALUES (ora_i, ora_f,ordine,sessione);
END$$