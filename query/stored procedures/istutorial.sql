DELIMITER $$
CREATE PROCEDURE `istutorial` (in id int)
BEGIN
	select id_tutorial
    from tutorial
    where id_tutorial=id;
END$$