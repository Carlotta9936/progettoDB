DELIMITER $$
CREATE PROCEDURE `autenticazione`(name varchar(30), password varchar(60))
BEGIN
	SELECT * FROM utente WHERE username = name AND password = password; 
	SELECT ruolo FROM ruoli WHERE username = name;
END$$
