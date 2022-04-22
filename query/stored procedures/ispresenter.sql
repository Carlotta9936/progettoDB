DELIMITER $$
CREATE PROCEDURE `ispresenter` (in id int)
BEGIN
	select *
    from presenter
    where id_presenter=id;
END$$
