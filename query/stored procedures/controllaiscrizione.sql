DELIMITER $$
CREATE  PROCEDURE `controllaiscrizione`(user varchar(30), anno int, acronimo varchar(10))
BEGIN
	select iscrizione.iscrizione_username
    from iscrizione
    where iscrizione.iscrizione_username=user and iscrizione.iscrizione_anno=anno and iscrizione.iscrizione_acronimo=acronimo;
END$$