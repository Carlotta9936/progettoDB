DELIMITER $$
CREATE PROCEDURE `vota`(username varchar(30), presentazione int, voto int)
BEGIN
	insert into valutazione (valutazione_admin, valutazione_presentazione, valutazione) values (username, presentazione, voto);
    
END$$