DELIMITER $$
CREATE  TRIGGER `aggiornaNumeroPresentazioni` AFTER INSERT ON `presentazione` FOR EACH ROW BEGIN
	update sessione set num_presentazioni = num_presentazioni + 1 where id_sessione = NEW.sessione;
    
END$$

DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `aggiornaNumeroPresentazioniCanc` AFTER DELETE ON `presentazione` FOR EACH ROW BEGIN
	update sessione set num_presentazioni = num_presentazioni - 1 where id_sessione = OLD.sessione;
    
END$$
DELIMITER $$

CREATE  TRIGGER `aggiornaStato` BEFORE UPDATE ON `articolo` FOR EACH ROW BEGIN
	if new.usernamePresenter is not null then
        SET new.stato= 'coperto' ;
    end if;
    
END$$DELIMITER $$
CREATE TRIGGER `aggiuntasponsorizzazione` AFTER INSERT ON `sponsorizzazione` FOR EACH ROW BEGIN
	update conferenza set totale_sponsorizzazioni=totale_sponsorizzazioni+1
    where conferenza.acronimo=new.acronimoConf and conferenza.anno=new.annoConf;
END$$