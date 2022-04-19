DELIMITER $$
USE `confvirtual`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ricercaUtenti`(ricerca varchar(30))
BEGIN
	(select username, utente.nome as nome, utente.cognome as cognome
	from utente
	where username = ricerca)
    union
	( select username, utente.nome as nome, utente.cognome as cognome
	from utente
	where username LIKE CONCAT('%', ricerca , '%'));
    
END$$