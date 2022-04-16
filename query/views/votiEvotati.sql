CREATE VIEW `votiEvotati` AS
    (select valutazione.valutazione as voto, presenta.presenta_usernameSpeaker as votato
    from valutazione, presenta
    where valutazione.valutazione_presentazione = presenta.tutorial)
    union
    (select valutazione.valutazione as voto, articolo.usernamePresenter as votato
    from valutazione, articolo
    where valutazione.valutazione_presentazione = articolo.id_articolo);