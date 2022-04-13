DELIMITER $$
CREATE PROCEDURE `autorepresenter` (in id int, in nome varchar(45),in congnome varchar(45))
BEGIN
	insert into autore (id_autore, nome, congome) values (id, nome, cognome);
END$$