DELIMITER $$
CREATE PROCEDURE classificaPresentatori ()
BEGIN
	select avg(valutazione) as mediaVoto, valutazione_presentazione
	from valutazione
	group by valutazione_presentazione
	order by mediaVoto
	DESC
	LIMIT 5;
END$$

DELIMITER ;