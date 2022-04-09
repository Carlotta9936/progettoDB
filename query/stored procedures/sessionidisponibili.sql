DELIMITER $$

CREATE PROCEDURE `sessionidisponibili`()
BEGIN
	select sessione.titolo as sessione, conferenza.anno as anno, conferenza.acronimo as acronimo,
    programma_giornaliero.data as data, sessione.id_sessione as id
    from sessione, conferenza, programma_giornaliero
    where sessione.programma=programma_giornaliero.id_programma and
    programma_giornaliero.anno=conferenza.anno and conferenza.acronimo=programma_giornaliero.acronimo
    and conferenza.svolgimento='attiva';
END$$

DELIMITER ;