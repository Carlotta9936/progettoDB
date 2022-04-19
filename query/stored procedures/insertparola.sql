DELIMITER $$
CREATE PROCEDURE `insertparola`(in newparola varchar(15),in newarticolo int)
BEGIN
    insert into chiave (parola,articolo) values (newparola, newarticolo);
END$$