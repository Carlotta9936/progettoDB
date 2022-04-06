DELIMITER $$
CREATE PROCEDURE eventiHype ()
BEGIN
	select count(*) as conta, preferiti_presentazione
	from preferiti
	group by preferiti_presentazione
	order by conta
	DESC
	LIMIT 5;
END$$

DELIMITER ;