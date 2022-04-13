DELIMITER $$
CREATE  PROCEDURE `updatePresenter`(username varchar(30), uni varchar(50), dip varchar(50), img varchar(50), curriculum varchar(50))
BEGIN
	INSERT INTO presenter (usernamePresenter, universita, dipartimento, foto, cv) VALUES (username, uni, dip, img, curriculum);
    
END$$

DELIMITER ;