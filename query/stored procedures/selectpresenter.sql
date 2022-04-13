DELIMITER $$
CREATE PROCEDURE `selectpresenter`()
BEGIN
	select massimo, usernamePresenter
    from presenter, maxid_presenter
    where massimo=id_presenter;
    
END$$