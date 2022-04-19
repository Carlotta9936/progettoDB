DELIMITER $$
CREATE PROCEDURE `insertconferenza`(in acronimo varchar (10) , in anno year(4) , in logo varchar (50) ,in datainizio date ,in datafine date,in nome varchar(50),in creatore varchar (45))
BEGIN
	
    INSERT INTO conferenza(acronimo, anno, logo, datainizio, datafine, nome, creatore) VALUES (acronimo, anno, logo, datainizio, datafine, nome, creatore);
    call aggiungiAssociazioni(creatore, anno, acronimo);
END$$