DELIMITER $$
CREATE PROCEDURE `updateSpeaker`(username varchar(30), uni varchar(50), dip varchar(50))
BEGIN
	INSERT INTO speaker (usernameSpeaker, universita, dipartimento) VALUES (username, uni, dip);

END$$

DELIMITER ;