DELIMITER $$
CREATE PROCEDURE `prsenterArticolo` (id int)
BEGIN
	select presenter.usernamePresenter as presenter
    from scritto, presenter
    where scritto.autore=(presenter.id_presenter+1000) and scritto.articolo=id;
END$$