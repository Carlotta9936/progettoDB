DELIMITER $$
CREATE PROCEDURE `selecttutorial`(in id int)
BEGIN
	select tutorial.titolo, tutorial.abstract, speaker.usernameSpeaker as speaker
    from tutorial, presenta, speaker
    where id_tutorial=id and presenta.tutorial=id_tutorial and presenta.presenta_usernameSpeaker=speaker.usernameSpeaker;
END$$