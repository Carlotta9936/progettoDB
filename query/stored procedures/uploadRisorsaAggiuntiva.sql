DELIMITER $$
CREATE PROCEDURE `uploadRisorsaAggiuntiva` (idRisorsaN int, linkN varchar (30), descrizioneN varchar(30))
BEGIN
	UPDATE risorsa_aggiuntiva SET link = linkN, descrizione = descrizioneN WHERE (id_risorsa = id_RisorsaN);
END$$

DELIMITER ;