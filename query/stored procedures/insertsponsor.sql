DELIMITER $$
CREATE PROCEDURE `insertsessione`(in ora_f time,in ora_i time ,in titolo varchar(100), in link varchar (50), in programma int)
BEGIN
	  
      INSERT INTO sessione(ora_f, ora_i, titolo, link, programma) VALUES (ora_f, ora_i, titolo, link, programma);

END$$