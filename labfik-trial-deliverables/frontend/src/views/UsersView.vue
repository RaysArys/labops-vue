<template>
  <div class="page">
    <header class="page-heading">
      <div>
        <span class="eyebrow">AKSES PENGGUNA</span>
        <h1>Tambah pengguna</h1>
        <p>Buat akun lokal baru dan tentukan cakupan aksesnya.</p>
      </div>
    </header>

    <div v-if="success" class="alert success">
      ✓ Akun <b>{{ success }}</b> berhasil dibuat.
    </div>
    <div v-if="error" class="alert danger">
      {{ error }}<button type="button" @click="error = ''">×</button>
    </div>

    <section class="user-create-grid">
      <article class="panel user-form">
        <form @submit.prevent="save">
          <div class="panel-title">
            <div>
              <h2>Informasi akun</h2>
              <p>
                Password tidak akan ditampilkan kembali setelah akun dibuat.
              </p>
            </div>
          </div>

          <div class="form-grid">
            <label class="span-2"
              >Nama lengkap *<input v-model="form.nama" required
            /></label>
            <label class="span-2"
              >Email *<input v-model="form.email" type="email" required
            /></label>
            <label
              >Password *<input
                v-model="form.password"
                type="password"
                minlength="8"
                required
              /><small
                >Minimal 8 karakter · Kekuatan: {{ strength }}</small
              ></label
            >
            <label
              >Konfirmasi password *<input
                v-model="confirmPassword"
                type="password"
                required
            /></label>
          </div>

          <h3 class="section-title">Pilih role</h3>
          <RoleSelector v-model="form.role" :roles="roleOptions" />

          <div class="modal-actions">
            <button type="button" class="btn ghost" @click="reset">
              Bersihkan
            </button>
            <button class="btn primary" :disabled="busy || !canSubmit">
              {{ busy ? "Membuat akun…" : "Buat akun pengguna" }}
            </button>
          </div>
        </form>
      </article>
      <UserInfoPanel />
    </section>
  </div>
</template>

<script setup lang="ts">
import RoleSelector from "../components/users/RoleSelector.vue";
import UserInfoPanel from "../components/users/UserInfoPanel.vue";
import { roleOptions } from "../components/users/roleOptions";
import { useUserCreate } from "../composables/useUserCreate";

const {
  form,
  confirmPassword,
  busy,
  error,
  success,
  strength,
  canSubmit,
  reset,
  save,
} = useUserCreate();
</script>

<style scoped>
.user-form .form-grid > label input {
  width: 100%;
  box-sizing: border-box;
}

.section-title {
  font-size: 14px;
}
</style>
