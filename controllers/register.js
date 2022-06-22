const handleRegister = (req, res, bcrypt, postgres) => {
    const { email, password, name} = req.body;
    if (!email || !password || !name) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    postgres.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user);
            })
            .catch(err => res.status(400).json('unable to register'));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
}

export default handleRegister;