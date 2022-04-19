DELIMITER $$
CREATE PROCEDURE `aggiornaInfoPS`(tabella varchar(30), user varchar(30), uni varchar(30), dip varchar(30), cuv varchar(30), photo varchar(30))
BEGIN  
	if tabella = "presenter" then
		UPDATE Presenter SET `universita` = uni, `dipartimento` = dip, `cv` = cuv, `foto` = photo WHERE (`usernamePresenter` = user);
    else
		UPDATE Speaker SET `universita` = uni, `dipartimento` = dip, `cv` = cuv, `foto` = photo WHERE (`usernameSpeaker` = user);
    end if;
END$$