DELIMITER $$
CREATE  TRIGGER `aggiornaNumeroPresentazioni` AFTER INSERT ON `presentazione` FOR EACH ROW BEGIN
	update sessione set num_presentazioni = num_presentazioni + 1 where id_sessione = NEW.sessione;
    
END$$
DELIMITER ;
