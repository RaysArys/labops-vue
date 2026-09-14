const bcrypt = require('bcrypt');
const { Client } = require('pg');

const users = [
  ['Tata Usaha Trial', 'tu.trial@labfik.local', 'tata_usaha'],
  ['Wakil Dekan Trial', 'wadek.trial@labfik.local', 'wakil_dekan'],
  ['Laboran Trial', 'laboran.trial@labfik.local', 'laboran'],
  ['Kepala Lab Trial', 'kalab.trial@labfik.local', 'kepala_lab'],
  ['Teknisi Trial', 'teknisi.trial@labfik.local', 'teknisi'],
];

async function run() {
  if (process.env.ALLOW_TRIAL_SEED !== 'true') {
    throw new Error('Set ALLOW_TRIAL_SEED=true untuk mengaktifkan akun trial lokal.');
  }

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'labfik_inventory',
  });
  await client.connect();
  const passwordHash = await bcrypt.hash(process.env.TRIAL_PASSWORD || 'Trial123!', 12);

  for (const [nama, email, role] of users) {
    await client.query(
      `INSERT INTO users (nama, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET nama = EXCLUDED.nama, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
      [nama, email, passwordHash, role],
    );
  }

  await client.end();
  console.log('Lima akun trial lokal berhasil disiapkan.');
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
