DELIMITER $$
CREATE PROCEDURE conferenze(username varchar(30))
BEGIN
	SELECT nome, acronimo, anno, datainizio, datafine
	FROM conferenza JOIN iscrizione on (conferenza.anno = iscrizione.iscrizione_anno AND conferenza.acronimo = iscrizione.iscrizione_acronimo)
	WHERE iscrizione_username = username;
END$$

DELIMITER ;

