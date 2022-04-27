DELIMITER $$
CREATE PROCEDURE `finepresentazione` (in id int)
BEGIN
	select programma_giornaliero.data as data, presentazione.ora_f as oraf
    from presentazione, sessione, programma_giornaliero
    where presentazione.id_presentazione=id and presentazione.sessione=sessione.id_sessione and sessione.programma=programma_giornaliero.id_programma;
END$$