DELIMITER $$
CREATE PROCEDURE `verificaconferenza`(in anno int,in acronimo varchar(10))
BEGIN
	select *
    from conferenza
    where conferenza.svolgimento='attiva' and conferenza.anno= anno and conferenza.acronimo=acronimo;
    
END$$
