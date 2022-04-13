CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `maxid_presenter` AS
    SELECT 
        MAX(`presenter`.`id_presenter`) AS `massimo`
    FROM
        `presenter`