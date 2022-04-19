DELIMITER $$
CREATE PROCEDURE `inserttutorial` (in id int, in titolo varchar(70), abstract varchar(500))
BEGIN
	insert into tutorial (id_tutorial, titolo, abstract) values (id,titolo, abstract);
END$$