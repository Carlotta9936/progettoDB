DELIMITER $$
CREATE PROCEDURE `insertrisorsa`(in link varchar(50),in  descrizione varchar(100),in tutorial int,in speaker varchar(45))
BEGIN
	
    insert into risorsa_aggiuntiva (link, descrizione,tutorial, usernameSpeaker) values (link, descrizione, tutorial, speaker);
END$$