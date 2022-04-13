DELIMITER $$

CREATE PROCEDURE `autorepresenter`(in id int, in nome varchar(45),in cognome varchar(45))
BEGIN
	insert into autore (id_autore, nome, cognome) values (id, nome, cognome);
END$$