DELIMITER $$
CREATE PROCEDURE eventiHype ()
BEGIN
	select count(*) as conta, iscrizione_acronimo, iscrizione_anno
	from iscrizione, conferenza
	WHERE iscrizione_acronimo = acronimo and iscrizione_anno = anno and svolgimento = "Attiva"
	group by iscrizione_anno, iscrizione_acronimo
	order by conta
	DESC
	LIMIT 5;
END$$