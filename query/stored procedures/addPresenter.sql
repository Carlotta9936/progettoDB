DELIMITER $$
CREATE PROCEDURE `addPresenter` (user varchar(30), articolo int)
BEGIN
	UPDATE `confvirtual`.`articolo` SET `usernamePresenter` = user WHERE (`id_articolo` = articolo);

END$$