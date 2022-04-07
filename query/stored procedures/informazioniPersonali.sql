DELIMITER $$
CREATE PROCEDURE informazioniPersonali(username varchar(30))
BEGIN
	SELECT username, nome, cognome, luogo_nascita, data_nascita FROM utente WHERE username = username;
END$$

DELIMITER ;