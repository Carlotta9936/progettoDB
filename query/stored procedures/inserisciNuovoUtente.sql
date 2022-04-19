DELIMITER $$
CREATE PROCEDURE inserisciNuovoUtente (username varchar(30), password varchar(60), nome varchar(45), cognome varchar(45), luogoNascita varchar(45), dataNascita DATETIME)
BEGIN
	INSERT INTO utente (username, password, nome, cognome, luogo_nascita, data_nascita) 
	VALUES (username, password, nome, cognome, luogoNascita, dataNascita);
END$$