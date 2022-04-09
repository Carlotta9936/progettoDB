DELIMITER $$

CREATE PROCEDURE `sponsorconferenza`()
BEGIN
	SELECT * FROM sponsor;
    SELECT acronimo,anno FROM conferenza;
    
END$$

DELIMITER ;