DELIMITER $$

CREATE PROCEDURE `conferenzedisponibili`()
BEGIN
	select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.datainizio as datainizio, conferenza.datafine as datafine
	from conferenza
	where conferenza.svolgimento='attiva';
END$$