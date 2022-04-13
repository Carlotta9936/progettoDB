DELIMITER $$
CREATE PROCEDURE `visualizzaautori`()
BEGIN
	select * from autore where id_autore<1000;
    
END$$