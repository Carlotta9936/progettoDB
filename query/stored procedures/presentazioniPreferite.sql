DELIMITER $$
CREATE PROCEDURE presentazioniPreferite(username varchar(30))
BEGIN
	select conferenza.nome as conferenzaNome, programma_giornaliero.data as programma_giornalieroData
	from conferenza inner join programma_giornaliero on (conferenza.anno=programma_giornaliero.anno and conferenza.acronimo=programma_giornaliero.acronimo)
	inner join sessione on( programma_giornaliero.id_programma=sessione.programma)
	inner join presentazione on(sessione.id_sessione= presentazione.sessione)
	inner join preferiti on (presentazione.id_presentazione = preferiti.preferiti_presentazione)
	where preferiti.preferiti_username = username;
END$$

DELIMITER ;

