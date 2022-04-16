DELIMITER $$
CREATE PROCEDURE `classificaPresentatori`()
BEGIN
	select votato, avg(voto) as mediaVoto
	from votiEvotati
	group by votato
	order by mediaVoto
	DESC
	LIMIT 5;
    
END$$
