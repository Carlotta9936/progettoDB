DELIMITER $$
CREATE PROCEDURE `getSessione`(id int)
BEGIN
	select *
    from sessione
    where id_sessione = id;
END$$