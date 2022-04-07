DELIMITER $$
CREATE PROCEDURE updateAmministratore(username varchar(30))
BEGIN
	INSERT INTO amministratore (usernameAdmin) VALUES (username); 
    UPDATE ruoli SET ruolo = 'admin' WHERE (ruoli_username = username);
END$$

DELIMITER ;