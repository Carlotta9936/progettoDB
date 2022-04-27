DELIMITER $$
CREATE PROCEDURE classificaPresentazioni ()
BEGIN
	select acronimo, anno, nome, count(*) as conta
	from presentazioneinconferenza inner join preferiti on (presentazioneinconferenza.idPresentazione = preferiti.preferiti_presentazione)
	group by acronimo, anno
	order by conta
	DESC
	LIMIT 5;
END$$