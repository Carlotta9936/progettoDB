USE `confvirtual`;
CREATE 
    VIEW `ruoli` AS
        SELECT 
            `amministratore`.`usernameAdmin` AS `username`,
            'Admin' AS `ruolo`
        FROM
            `amministratore` 
        UNION SELECT 
            `speaker`.`usernameSpeaker` AS `username`,
            'Speaker' AS `ruolo`
        FROM
            `speaker` 
        UNION SELECT 
            `presenter`.`usernamePresenter` AS `username`,
            'Presenter' AS `ruolo`
            
        FROM
            `presenter`;