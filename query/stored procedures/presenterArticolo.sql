DELIMITER $$
CREATE PROCEDURE `presenterArticolo`(id int)
BEGIN
	SELECT usernamePresenter
	FROM presenter, scritto
	WHERE autore = id_presenter and articolo=id;
    
END$$