DELIMITER $$

CREATE PROCEDURE `insertprogramma`( acronimo varchar(10),  anno year(4),  data date)
BEGIN
	
    INSERT INTO programma_giornaliero(acronimo, anno, data) VALUES (acronimo, anno , data);
END$$
