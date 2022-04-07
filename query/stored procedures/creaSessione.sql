DELIMITER $$
CREATE PROCEDURE creaSessione (oraF time, oraI time, titolo varchar(100), link varchar(50), num int, programma int)
BEGIN
	INSERT INTO sessione(ora_f, ora_i, titolo, link, num_presentazioni, programma) VALUES (oraF, oraI, titolo, link, num, programma);
END$$
DELIMITER ;