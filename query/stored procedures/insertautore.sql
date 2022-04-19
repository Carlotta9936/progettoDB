DELIMITER $$
CREATE PROCEDURE `insertautore`(in nome varchar(45),in  cognome varchar(45))
BEGIN
	
    INSERT INTO autore(nome, cognome) VALUES (nome, cognome);
END$$