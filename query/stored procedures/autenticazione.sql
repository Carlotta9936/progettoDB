DELIMITER $$
CREATE PROCEDURE `autenticazione`(name varchar(30), pass varchar(60))
BEGIN
	SELECT * FROM utente WHERE username = name AND password = pass;
END$$
