DELIMITER $$
CREATE PROCEDURE `getProgrammaGiornaliero`(anno int, acronimo varchar(10))
BEGIN
	select data, programma_giornaliero.anno as anno,programma_giornaliero.acronimo as acronimo
    from programma_giornaliero
   where programma_giornaliero.anno = anno and programma_giornaliero.acronimo = acronimo;
END$$