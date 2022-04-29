DELIMITER $$
CREATE PROCEDURE `nomesponsor`(acronimo varchar(10), anno int)
BEGIN
	SELECT nome
	FROM confvirtual.sponsor 
	WHERE nome not in (
		SELECT nome_sponsor
		FROM confvirtual.sponsorizzazione 
		WHERE acronimoConf=acronimo and annoConf=anno);
END$$