DELIMITER $$
CREATE PROCEDURE `verificaorariosessione` (in id int)
BEGIN
	select sessione.ora_f as oraf, sessione.ora_i as orai, conferenza.anno as anno, conferenza.acronimo as acronimo programma_giornaliero.data as data
    from sessione, conferenza, programma_giornaliero
    where sessione.id_sessione=id and sessione.programma=programma_giornaliero.id_programma and programma_giornaliero.anno=conferenza.anno and
    programma_giornaliero.acronimo=conferenza.acronimo;
END$$