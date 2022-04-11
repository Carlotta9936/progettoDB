DELIMITER $$
CREATE PROCEDURE `contasponsor`(in anno year(4),in acronimo varchar(10))
BEGIN
	select count(nome_sponsor)as num_sponsorizzazioni
	from sponsorizzazione
    where annoConf=anno and acronimoConf=acronimo
	group by annoConf, acronimoConf;
END$$
