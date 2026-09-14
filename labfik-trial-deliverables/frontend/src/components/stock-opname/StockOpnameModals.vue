<template>
  <Modal
    v-if="periodOpen"
    title="Buka periode opname"
    subtitle="Tentukan tanggal dan cakupan pemeriksaan."
    @close="$emit('close-period-modal')"
  >
    <form @submit.prevent="$emit('open-period')">
      <label
        >Tanggal mulai *<input
          v-model="periodForm.tanggal"
          type="date"
          required /></label
      ><label
        >Cakupan lokasi<input
          v-model="periodForm.lokasi"
          placeholder="Contoh: Lab Komputer lantai 3"
      /></label>
      <div class="modal-actions">
        <button
          type="button"
          class="btn ghost"
          @click="$emit('close-period-modal')"
        >
          Batal</button
        ><button class="btn primary" :disabled="busy">Buka periode</button>
      </div>
    </form>
  </Modal>

  <Modal
    v-if="inspectionOpen"
    title="Input pemeriksaan"
    subtitle="Cari aset lalu masukkan kondisi fisiknya."
    wide
    @close="$emit('close-inspection-modal')"
  >
    <div class="tabs">
      <button
        type="button"
        :class="{ active: inspectionTab === 'existing' }"
        @click="inspectionTab = 'existing'"
      >
        Aset terdaftar</button
      ><button
        type="button"
        :class="{ active: inspectionTab === 'new' }"
        @click="inspectionTab = 'new'"
      >
        Aset baru
      </button>
    </div>
    <form
      v-if="inspectionTab === 'existing'"
      @submit.prevent="$emit('inspect')"
    >
      <label
        >Cari aset<input
          v-model="assetSearch"
          placeholder="Nama, inventaris, atau serial"
          @input="$emit('search-assets')"
      /></label>
      <div class="asset-picker">
        <button
          v-for="asset in searchResults"
          :key="asset.asset_id"
          type="button"
          :class="{ active: inspection.asset_id === asset.asset_id }"
          @click="inspection.asset_id = asset.asset_id"
        >
          <strong>{{ asset.nama_aset }}</strong
          ><small>{{ asset.no_inventaris || short(asset.asset_id) }}</small>
        </button>
      </div>
      <div class="form-grid">
        <label
          >Kondisi fisik<select v-model="inspection.kondisi">
            <option
              v-for="(label, key) in conditionLabel"
              :key="key"
              :value="key"
            >
              {{ label }}
            </option>
          </select></label
        ><label
          >Jumlah fisik<input
            v-model.number="inspection.qty"
            type="number"
            min="0"
            step="0.01" /></label
        ><label class="span-2"
          >Lokasi aktual<input v-model="inspection.lokasi"
        /></label>
      </div>
      <p class="form-hint">
        Jumlah 0 otomatis menjadi “Tidak ditemukan”. Kondisi rusak otomatis
        membuat Work Order.
      </p>
      <div class="modal-actions">
        <button
          type="button"
          class="btn ghost"
          @click="$emit('close-inspection-modal')"
        >
          Batal</button
        ><button class="btn primary" :disabled="!inspection.asset_id || busy">
          Simpan pemeriksaan
        </button>
      </div>
    </form>
    <form v-else @submit.prevent="$emit('register-new')">
      <div class="form-grid">
        <label class="span-2"
          >Nama aset *<input v-model="newAsset.nama" required /></label
        ><label
          >Kategori<select v-model="newAsset.kategori">
            <option
              v-for="(label, key) in categoryLabel"
              :key="key"
              :value="key"
            >
              {{ label }}
            </option>
          </select></label
        ><label
          >Kondisi<select v-model="newAsset.kondisi">
            <option
              v-for="(label, key) in conditionLabel"
              :key="key"
              :value="key"
            >
              {{ label }}
            </option>
          </select></label
        ><label
          >Jumlah<input
            v-model.number="newAsset.qty"
            type="number"
            min="0.01"
            step="0.01" /></label
        ><label>Lokasi aktual<input v-model="newAsset.lokasi" /></label>
      </div>
      <p class="form-hint">
        Aset baru masuk Master Aset sebagai draft untuk diajukan Tata Usaha.
      </p>
      <div class="modal-actions">
        <button
          type="button"
          class="btn ghost"
          @click="$emit('close-inspection-modal')"
        >
          Batal</button
        ><button class="btn primary" :disabled="busy">Daftarkan aset</button>
      </div>
    </form>
  </Modal>

  <Modal
    v-if="followRecord"
    title="Tindak lanjut temuan"
    :subtitle="assetMap.get(followRecord.asset_id)?.nama_aset"
    @close="$emit('close-follow')"
    ><form @submit.prevent="$emit('save-follow')">
      <label
        >Status<select v-model="followForm.status">
          <option v-for="(label, key) in followLabel" :key="key" :value="key">
            {{ label }}
          </option>
        </select></label
      ><label
        >PIC tindak lanjut<input
          v-model="followForm.pic"
          placeholder="UUID pengguna" /></label
      ><label
        >Target selesai<input v-model="followForm.target" type="date"
      /></label>
      <div class="modal-actions">
        <button type="button" class="btn ghost" @click="$emit('close-follow')">
          Batal</button
        ><button class="btn primary" :disabled="busy">
          Simpan tindak lanjut
        </button>
      </div>
    </form></Modal
  >
</template>

<script setup lang="ts">
import Modal from "../ui/Modal.vue";
import type {
  Asset,
  AssetKategori,
  AssetKondisi,
  FollowUpStatus,
  StockOpnameRecord,
} from "../../types";

defineProps<{
  periodOpen: boolean;
  inspectionOpen: boolean;
  busy: boolean;
  searchResults: Asset[];
  inspection: {
    asset_id: string;
    kondisi: AssetKondisi;
    qty: number;
    lokasi: string;
  };
  newAsset: {
    nama: string;
    kategori: AssetKategori;
    kondisi: AssetKondisi;
    qty: number;
    lokasi: string;
  };
  periodForm: { tanggal: string; lokasi: string };
  followRecord: StockOpnameRecord | null;
  followForm: { status: FollowUpStatus; pic: string; target: string };
  assetMap: Map<string, Asset>;
  conditionLabel: Record<string, string>;
  categoryLabel: Record<string, string>;
  followLabel: Record<string, string>;
  short: (value: string) => string;
}>();

const inspectionTab = defineModel<"existing" | "new">("inspectionTab", {
  default: "existing",
});
const assetSearch = defineModel<string>("assetSearch", { default: "" });
defineEmits<{
  "close-period-modal": [];
  "open-period": [];
  "close-inspection-modal": [];
  inspect: [];
  "search-assets": [];
  "register-new": [];
  "close-follow": [];
  "save-follow": [];
}>();
</script>
