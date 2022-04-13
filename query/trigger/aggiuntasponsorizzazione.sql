DELIMITER $$
CREATE TRIGGER `aggiuntasponsorizzazione` AFTER INSERT ON `sponsorizzazione` FOR EACH ROW BEGIN
	update conferenza set totale_sponsorizzazioni=totale_sponsorizzazioni+1
    where conferenza.acronimo=new.acronimoConf and conferenza.anno=new.annoConf;
END$$