DELIMITER $$
CREATE PROCEDURE `selecttutorial` (in id int)
BEGIN
	select utente.nome as nome, utente.cognome as cognome, tutorial.titolo, tutorial.abstract, speaker.usernameSpeaker as speaker
    from tutorial, presenta, speaker, utente
    where id_tutorial=id and presenta.tutorial=id_tutorial and presenta.presenta_usernameSpeaker=speaker.usernameSpeaker;
END$$