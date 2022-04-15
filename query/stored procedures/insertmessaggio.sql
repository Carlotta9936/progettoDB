DELIMITER $$
CREATE PROCEDURE `insertmessaggio` (in ora time(4), in sessione int,in user varchar(30),in testo varchar(500),in giorno date)
BEGIN
	insert into messaggio(ora,sessione,username,testo,data)values(ora,sessione,user,testo,giorno);
END$$