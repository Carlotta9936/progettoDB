DELIMITER $$
CREATE PROCEDURE `autorepresenter`(in nome varchar(45),in cognome varchar(45))
BEGIN
	insert into autore (nome, cognome, presenter) values (nome, cognome, 1);
END$$