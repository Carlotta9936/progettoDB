
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `aggiornaNumeroPresentazioniCanc` AFTER DELETE ON `presentazione` FOR EACH ROW BEGIN
	update sessione set num_presentazioni = num_presentazioni - 1 where id_sessione = OLD.sessione;
    
END$$
