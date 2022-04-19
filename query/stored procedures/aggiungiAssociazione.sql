DELIMITER $$
CREATE PROCEDURE `aggiungiAssociazioni`(user varchar(30), anno int, acronimo varchar(10))
BEGIN
    INSERT INTO `associazione` (`associazione_anno`, `associazione_acronimo`, `associazione_username`) VALUES (anno, acronimo, user);
END$$