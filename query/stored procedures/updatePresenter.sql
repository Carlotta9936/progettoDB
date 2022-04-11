DELIMITER $$
CREATE PROCEDURE `updatePresenter`(username varchar(30), uni varchar(50), dip varchar(50))
BEGIN
	INSERT INTO presenter (usernamePresenter, universita, dipartimento) VALUES (username, uni, dip);

END$$

DELIMITER ;