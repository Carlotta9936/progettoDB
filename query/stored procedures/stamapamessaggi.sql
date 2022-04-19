DELIMITER $$
CREATE PROCEDURE `stampamessaggi` (in id int)
BEGIN
	select username,ora,testo
    from messaggio
    where sessione=id;
END$$