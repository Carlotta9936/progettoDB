DELIMITER $$
CREATE PROCEDURE `insertsegui`(in anno year(4),in  acronimo varchar (10),in  iscrizione_username varchar(45))
BEGIN
    INSERT INTO iscrizione (iscrizione_anno, iscrizione_acronimo, iscrizione_username) VALUES (anno, acronimo, iscrizione.username);
END$$