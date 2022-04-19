DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAssociati`(anno int, acronimo varchar(10))
BEGIN
	select associazione_username
    from associazione
    where associazione_anno = anno and associazione_acronimo = acronimo;
END$$