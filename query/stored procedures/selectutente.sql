DELIMITER $$
CREATE PROCEDURE `selectutente` (in utente varchar(30))
BEGIN
	select nome, cognome
    from utente
    where username=utente;
END$$