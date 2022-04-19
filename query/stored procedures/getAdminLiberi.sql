DELIMITER $$
CREATE PROCEDURE `getAdminLiberi`(anno int, acronimo varchar(10))
BEGIN
	SELECT * 
	FROM confvirtual.amministratore
	where usernameAdmin not in ( select associazione_username
									from associazione
									where associazione_acronimo=acronimo and associazione_anno=anno);
END$$