CREATE VIEW `presentazioneinconferenza` AS
    SELECT 
        `conferenza`.`nome` AS `nome`,
        `conferenza`.`acronimo` AS `acronimo`,
        `conferenza`.`anno` AS `anno`,
        `conferenza`.`creatore` AS `creatore`,
        `conferenza`.`datainizio` AS `datainizio`,
        `conferenza`.`datafine` AS `datafine`,
        `conferenza`.`logo` AS `logo`,
        `programma_giornaliero`.`data` AS `data`,
        `sessione`.`link` AS `link`,
        `sessione`.`ora_i` AS `ora_i`,
        `sessione`.`ora_f` AS `ora_f`,
        `presentazione`.`id_presentazione` AS `idPresentazione`
        
    FROM
        (((`conferenza`
        JOIN `programma_giornaliero` ON (((`conferenza`.`anno` = `programma_giornaliero`.`anno`)
            AND (`conferenza`.`acronimo` = `programma_giornaliero`.`acronimo`))))
        JOIN `sessione` ON ((`programma_giornaliero`.`id_programma` = `sessione`.`programma`)))
        JOIN `presentazione` ON ((`sessione`.`id_sessione` = `presentazione`.`sessione`)));
