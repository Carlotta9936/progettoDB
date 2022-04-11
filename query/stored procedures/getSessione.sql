DELIMITER $$
CREATE PROCEDURE `getSessione`(id int)
BEGIN
	select *
    from conferenza
    where id_conferenza = id;
END$$
