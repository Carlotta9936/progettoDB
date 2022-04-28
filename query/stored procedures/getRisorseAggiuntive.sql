DELIMITER $$
CREATE PROCEDURE `getRisorseAggiuntive` (idTutorial int)
BEGIN
	select link, descrizione, id_risorsa
    from risorsa_aggiuntiva
    where tutorial = idTutorial;
END$$