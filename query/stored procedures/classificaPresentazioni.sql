DELIMITER $$
CREATE PROCEDURE classificaPresentazioni ()
BEGIN
	select count(*) as conta, iscrizione_acronimo, iscrizione_anno
	from iscrizione
	#WHERE presentazione stato = "Attiva"
	group by iscrizione_anno, iscrizione_acronimo
	order by conta
	DESC
	LIMIT 5;
END$$

DELIMITER ;