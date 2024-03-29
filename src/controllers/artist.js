const db = require("../db/index");

const createArtist = async (req, res) => {
  const { name, genre } = req.body;

  try {
    const {
      rows: [artist],
    } = await db.query(
      `INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *`,
      [name, genre]
    );
    res.status(201).json(artist);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const readArtist = async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM artists");
    const artists = response.rows;

    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getArtistbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rows: [artist],
    } = await db.query("SELECT * FROM artists WHERE id = $1", [id]);

    if (!artist) {
      return res.status(404).json({ message: `artist ${id} does not exist` });
    }

    res.status(200).json(artist);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const updateArtist = async (req, res) => {
  const { id } = req.params;
  const { name, genre } = req.body;

  let query, params;

  if (name && genre) {
    query = `UPDATE Artists SET name = $1, genre = $2 WHERE id = $3 RETURNING *`;
    params = [name, genre, id];
  } else if (name) {
    query = `UPDATE Artists SET name = $1 WHERE id = $2 RETURNING *`;
    params = [name, id];
  } else if (genre) {
    query = `UPDATE Artists SET genre = $1 WHERE id = $2 RETURNING *`;
    params = [genre, id];
  }

  try {
    const {
      rows: [artist],
    } = await db.query(query, params);

    if (!artist) {
      return res.status(404).json({ message: `artist ${id} does not exist` });
    }

    res.status(200).json(artist);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

const deleteArtist = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      rows: [artist],
    } = await db.query("DELETE FROM Artists WHERE id = $1 RETURNING *", [id]);

    if (!artist) {
      return res.status(404).json({ message: `artist ${id} does not exist` });
    }

    res.status(200).json(artist);
  } catch (err) {
    res.status(500).json(err.messsage);
  }
};

module.exports = {
  createArtist,
  readArtist,
  getArtistbyId,
  updateArtist,
  deleteArtist,
};
