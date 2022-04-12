DELIMITER $$

CREATE  TRIGGER `aggiornaStato` BEFORE UPDATE ON `articolo` FOR EACH ROW BEGIN
	if new.usernamePresenter is not null then
        SET new.stato= 'coperto' ;
    end if;
    
END$$