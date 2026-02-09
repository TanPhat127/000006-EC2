const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    queueLimit: 0
});

exports.view = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user ORDER BY id DESC');
        
        let removeUser = req.query.removed;
        res.render('home', { rows, removeUser });
        
        console.log('The data from user table: \n', rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Database error');
    }
};

exports.find = async (req, res) => {
    try {
        let searchTerm = req.body.search;
        
        const [rows] = await pool.query(
            'SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', 
            ['%' + searchTerm + '%', '%' + searchTerm + '%']
        );

        res.render('home', { rows });
        console.log('The data from user table: \n', rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error searching user');
    }
};

exports.form = (req, res) => {
    res.render('add-user');
};

exports.create = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, comments } = req.body;
        
        const [rows] = await pool.query(
            'INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?',
            [first_name, last_name, email, phone, comments]
        );

        res.render('add-user', { alert: 'User added Successfully.' });
        console.log('The data from user table: \n', rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error creating user');
    }
};

exports.edit = async (req, res) => {    
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [req.params.id]);
        
        res.render('edit-user', { rows });
        console.log('The data from user table: \n', rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error loading user');
    }
};

exports.update = async (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    let connection;

    try {
        connection = await pool.getConnection();

        await connection.query(
            'UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?',
            [first_name, last_name, email, phone, comments, req.params.id]
        );

        const [rows] = await connection.query('SELECT * FROM user WHERE id = ?', [req.params.id]);

        res.render('edit-user', { rows, alert: `${first_name} has been updated` });
        console.log('The data from user table: \n', rows);

    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating user');
    } finally {
        if (connection) connection.release();
    }
};

exports.delete = async (req, res) => {
    try {
        const [rows] = await pool.query('DELETE FROM user WHERE id = ?', [req.params.id]);
        
        let removeUser = encodeURIComponent('Record successfully removed');
        res.redirect('/?removed=' + removeUser);
        
        console.log('The data from user table: \n', rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting user');
    }
};

exports.viewall = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [req.params.id]);
        
        res.render('view-user', { rows });
        console.log('The data from user table: \n', rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error viewing user');
    }
};
