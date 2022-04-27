DELIMITER $$
CREATE PROCEDURE `getRisorseAggiuntive` (idTutorial int)
BEGIN
	select link
    from risorsa_aggiuntiva
    where tutorial = idTutorial;
END$$