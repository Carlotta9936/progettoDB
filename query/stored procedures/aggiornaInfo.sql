DELIMITER $$
CREATE PROCEDURE `aggiornaInfo` (Nusername varchar(30), Npassword varchar(60), Nnome varchar(40), Ncognome varchar(40), nluogo_nascita varchar(40), ndata_nascita Date)
BEGIN
	UPDATE `utente` SET `username` = Nusername, `password` = Npassword, `nome` = Nnome, `cognome` = Ncognome, `luogo_nascita` = nluogo_nascita, `data_nascita` = ndata_nascita WHERE (`username` = Nusername);
END$$