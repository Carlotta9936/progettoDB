DELIMITER $$
CREATE PROCEDURE `addadminconferenza` (user varchar(30), anno int, acronimo varchar(10))
BEGIN
	insert into iscrizione (iscrizione_anno,iscrizione_acronimo,iscrizione_username) values (anno, acronimo, user);
END$$