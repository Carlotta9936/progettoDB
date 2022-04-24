DELIMITER $$
CREATE PROCEDURE `selecttutorial`(in id int)
BEGIN
	select utente.username as speaker, tutorial.titolo as titolo , tutorial.abstract as abstract
    from tutorial, presenta, speaker, utente
    where id_tutorial=id and presenta.tutorial=id_tutorial and presenta.presenta_usernameSpeaker=speaker.usernameSpeaker;
END$$