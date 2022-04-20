DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `verificaorariosessione`(in id int)
BEGIN
	select sessione.ora_f as oraf, sessione.ora_i as orai, programma_giornaliero.data as data
    from sessione, conferenza, programma_giornaliero
    where sessione.id_sessione=id and sessione.programma=programma_giornaliero.id_programma and programma_giornaliero.anno=conferenza.anno and
    programma_giornaliero.acronimo=conferenza.acronimo;
END$$