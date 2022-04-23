DELIMITER $$
CREATE PROCEDURE `isarticolo` (in id int)
BEGIN
	select id_articolo
    from articolo
    where id_articolo=id;
END$$