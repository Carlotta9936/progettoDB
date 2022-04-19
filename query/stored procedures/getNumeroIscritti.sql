DELIMITER $$
CREATE PROCEDURE `getNumeroIscritti`(anno int, acronimo varchar(30))
BEGIN
	select count(*) as numIscritti
	from iscrizione
	where iscrizione_acronimo=acronimo and iscrizione_anno = anno;
    
END$$