DELIMITER $$
CREATE PROCEDURE `sessionedata` (in sessione int)
BEGIN
	select programma_giornaliero.data as data
	from sessione, programma_giornaliero
    where sessione.id_sessione=sessione and sessione.programma=programma_giornaliero.id_programma;
END$$