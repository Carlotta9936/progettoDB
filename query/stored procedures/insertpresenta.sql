DELIMITER $$
CREATE PROCEDURE `insertpresenta` (in username varchar(30), in tutorial int)
BEGIN
	insert into presenta (presenta_usernameSpeaker, tutorial) values (username, tutorial);
END$$