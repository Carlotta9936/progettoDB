DELIMITER $$
USE `confvirtual`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ricercaConferenze`(ricerca varchar(40))
BEGIN
	(select nome, acronimo, anno
	from conferenza
	where nome = ricerca)
    union
	( select nome, acronimo, anno
	from conferenza
	where nome LIKE CONCAT('%', ricerca , '%'));
    
END$$