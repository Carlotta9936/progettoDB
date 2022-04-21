DELIMITER $$
CREATE PROCEDURE `presentazioneInConferenza	` (in id_pres int)
BEGIN
	select programma_giornaliero.anno as anno, programma_giornaliero.acronimo as acronimo
    from presentazione inner join sessione on(presentazione.sessione=sessione.id_sessione) inner join programma_giornaliero on(sessione.programma=programma_giornaliero.id_programma)
    where presentazione.id_presentazione=id_pres;
END$$