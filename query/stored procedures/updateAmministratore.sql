DELIMITER $$
CREATE PROCEDURE updateAmministratore(username varchar(30))
BEGIN
	INSERT INTO amministratore (usernameAdmin) VALUES (username); 
END$$

DELIMITER ;