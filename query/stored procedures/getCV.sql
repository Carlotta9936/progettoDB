DELIMITER $$
CREATE PROCEDURE `getCV` (name varchar(30))
BEGIN
	select cv
    from presenterespeaker
    where username = name;
END$$

DELIMITER ;