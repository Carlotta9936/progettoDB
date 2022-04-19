DELIMITER $$
CREATE  PROCEDURE `nomesponsor`()
BEGIN
	select sponsor.nome as nome
	from sponsor;
END$$