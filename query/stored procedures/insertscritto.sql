DELIMITER $$
CREATE PROCEDURE `insertscritto`(in autore int, in articolo int)
BEGIN
	
    INSERT INTO scritto(autore, articolo) VALUES (autore, articolo);
END$$