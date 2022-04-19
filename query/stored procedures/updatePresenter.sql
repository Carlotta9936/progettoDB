DELIMITER $$
CREATE PROCEDURE `updateSpeaker`(username varchar(30), uni varchar(50), dip varchar(50), img varchar(50), curriculum varchar(50))
BEGIN
	INSERT INTO speaker (usernameSpeaker, universita, dipartimento, foto, cv) VALUES (username, uni, dip, img, curriculum);
    
    
END$$
