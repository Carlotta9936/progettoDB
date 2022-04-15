DELIMITER $$

CREATE PROCEDURE `selectarticolo`(in id int)
BEGIN
	select autore.nome as nome ,autore.cognome as cognome, articolo, pdf, stato, n_pagine, titolo, articolo.usernamePresenter as presenter
    from scritto inner join autore on (autore=id_autore) ,articolo left join presenter on (articolo.usernamePresenter=presenter.usernamePresenter)
    where id_articolo=id and id_articolo=scritto.articolo;
END$$