DELIMITER $$
CREATE PROCEDURE `selectpresenter` ()
BEGIN
	select max(id_presenter) as id, username
    from presenter;
END$$