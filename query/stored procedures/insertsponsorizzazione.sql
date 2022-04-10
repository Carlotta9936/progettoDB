DELIMITER $$

CREATE PROCEDURE `insertsponsor`(in nome varchar (50), in logo varchar (30))
BEGIN
    INSERT INTO sponsor(nome, logo) VALUES (nome , logo);
END$$