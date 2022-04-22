DELIMITER $$
CREATE PROCEDURE `titoloarticolo` (id int)
BEGIN
	select	articolo.titolo
    from articolo
    where articolo.id_articolo=id;
END$$