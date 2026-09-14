<template>
  <aside class="panel info-panel">
    <span class="info-big">♙</span>
    <h2>Tentang akun</h2>
    <p>Halaman ini hanya membuat user pada database lokal LabOps FIK.</p>
    <div class="alert warning">
      Saat memakai Keycloak, akun dan role dibuat melalui Keycloak Admin Console
      oleh administrator.
    </div>
    <ul>
      <li>Email harus unik.</li>
      <li>Password disimpan dalam bentuk hash.</li>
      <li>Role membatasi menu dan aksi backend.</li>
      <li>Aktivitas pengguna tercatat dalam audit log.</li>
    </ul>
  </aside>
</template>
