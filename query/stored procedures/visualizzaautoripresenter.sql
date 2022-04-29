DELIMITER $$
CREATE PROCEDURE `visualizzaautoripresenter`()
BEGIN
	select * from autore where presenter=1;
END$$
