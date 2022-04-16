DELIMITER $$
CREATE PROCEDURE `getInfoPS` (nome varchar(30))
BEGIN
	select *
    from presenterespeaker
    where username = nome;
END$$
