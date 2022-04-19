DELIMITER $$
CREATE PROCEDURE `cercaconferenza`(in anno year(4),in acronimo varchar(10))
BEGIN
	select *
    from conferenza
    where conferenza.anno= anno and conferenza.acronimo=acronimo;
    
END$$