DELIMITER $$
CREATE PROCEDURE `trovaUtente`(user varchar(30))
BEGIN
	SELECT username 
    FROM utente 
    WHERE username = user;
    
END$$
DELIMITER ;