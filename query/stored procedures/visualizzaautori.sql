DELIMITER $$
CREATE PROCEDURE `visualizzaautori`()
BEGIN
	select * from autore where presenter=0;
END$$