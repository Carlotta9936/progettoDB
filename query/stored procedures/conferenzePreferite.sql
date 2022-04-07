DELIMITER $$
CREATE PROCEDURE conferenzePreferite (username varchar(30))
BEGIN
	SELECT conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.dataInizio as datainizio, conferenza.dataFine as datafine
	FROM conferenza inner join iscrizione on (conferenza.anno = iscrizione.iscrizione_anno and conferenza.acronimo = iscrizione.iscrizione_acronimo)
	WHERE iscrizione_username = username;
END$$

DELIMITER ;