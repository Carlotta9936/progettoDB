DELIMITER $$
CREATE PROCEDURE `specificaconferenza`(in anno year(4),in acronimo varchar(10))
BEGIN
	select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno,
    conferenza.creatore as creatore, conferenza.datainizio as datainizio, conferenza.datafine as datafine,
    conferenza.logo as logo, programma_giornaliero.data as data, sessione.link as link, sessione.ora_i as orai, 
    sessione.titolo as titolosessione, sessione.ora_f as oraf, programma_giornaliero.data as data,
    sessione.id_sessione as sessione
	from conferenza inner join programma_giornaliero on (conferenza.anno=programma_giornaliero.anno and conferenza.acronimo=programma_giornaliero.acronimo)
	inner join sessione on( programma_giornaliero.id_programma=sessione.programma)
	where conferenza.anno= anno and conferenza.acronimo= acronimo;
END$$
