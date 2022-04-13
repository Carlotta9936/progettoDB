DELIMITER $$
CREATE PROCEDURE `getFilePersonali`(username varchar(50))
BEGIN
	(select cv as cv, foto as image
    from presenter
    where usernamePresenter = username)
    union
    (select cv as cv, foto as image
    from speaker
    where usernameSpeaker = username);
    
END$$
