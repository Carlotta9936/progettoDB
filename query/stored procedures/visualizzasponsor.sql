DELIMITER $$
CREATE PROCEDURE `visualizzasponsor`(in anno year(4), in acronimo varchar(10))
BEGIN
	select sponsor.nome
	from conferenza, sponsor, sponsorizzazione
	where conferenza.svolgimento='attiva' 
    and conferenza.anno= anno
	and conferenza.acronimo= acronimo
	and conferenza.anno=sponsorizzazione.annoConf 
	and conferenza.acronimo=sponsorizzazione.acronimoConf
	and sponsorizzazione.nome_sponsor=sponsor.nome;
                        
END$$