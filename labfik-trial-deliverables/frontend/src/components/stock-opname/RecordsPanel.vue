<template>
  <main class="panel records-panel">
    <div v-if="selectedPeriod" class="panel-title">
      <div>
        <h2>Hasil pemeriksaan</h2>
        <p>
          {{ selectedPeriod.cakupan_lokasi || "Semua lokasi" }} ·
          {{ formatDate(selectedPeriod.tanggal_mulai) }}
        </p>
      </div>
      <div class="row-actions">
        <button
          v-if="isLaboran && selectedPeriod.status === 'aktif'"
          class="btn primary"
          @click="$emit('inspect')"
        >
          ＋ Pemeriksaan</button
        ><button
          v-if="selectedPeriod.status === 'aktif'"
          class="btn danger ghost"
          @click="$emit('close-period')"
        >
          Tutup periode
        </button>
      </div>
    </div>
    <div v-if="selectedPeriod" class="toolbar compact">
      <label class="search"
        >⌕<input
          v-model="query"
          placeholder="Cari aset atau inventaris…" /></label
      ><select v-model="finding">
        <option value="all">Semua hasil</option>
        <option value="open">Perlu tindak lanjut</option>
        <option v-for="(label, key) in findingLabel" :key="key" :value="key">
          {{ label }}
        </option>
      </select>
    </div>
    <EmptyState
      v-if="!selectedPeriod"
      title="Pilih periode"
      text="Daftar pemeriksaan akan tampil di sini."
    />
    <div v-else-if="recordsLoading" class="loading-block">
      <div />
      <div />
      <div />
    </div>
    <EmptyState
      v-else-if="!filtered.length"
      title="Belum ada pemeriksaan"
      text="Mulai pemeriksaan atau ubah filter."
    />
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Aset</th>
            <th>Fisik</th>
            <th>Lokasi aktual</th>
            <th>Hasil</th>
            <th>Tindak lanjut</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filtered" :key="record.record_id">
            <td>
              <strong>{{
                assetMap.get(record.asset_id)?.nama_aset ||
                "Aset tidak ditemukan"
              }}</strong
              ><small class="block">{{
                assetMap.get(record.asset_id)?.no_inventaris ||
                short(record.asset_id)
              }}</small>
            </td>
            <td>
              {{ record.qty_fisik }}
              {{ assetMap.get(record.asset_id)?.satuan || "unit"
              }}<StatusBadge
                class="block"
                :text="conditionLabel[record.kondisi_fisik]"
                :tone="record.kondisi_fisik === 'rusak' ? 'danger' : 'success'"
              />
            </td>
            <td>{{ record.lokasi_aktual || "—" }}</td>
            <td>
              <StatusBadge
                :text="findingLabel[record.status_temuan]"
                :tone="
                  record.status_temuan === 'sesuai' ? 'success' : 'warning'
                "
              />
            </td>
            <td>
              {{
                record.status_tindak_lanjut
                  ? followLabel[record.status_tindak_lanjut]
                  : "—"
              }}
            </td>
            <td>
              <button
                v-if="isHead && record.status_temuan !== 'sesuai'"
                class="btn tiny ghost"
                @click="$emit('follow', record)"
              >
                Tindak lanjut</button
              ><span v-if="record.work_order_id" class="wo-ref">WO dibuat</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
import EmptyState from "../ui/EmptyState.vue";
import StatusBadge from "../ui/StatusBadge.vue";
import type {
  Asset,
  FindingStatus,
  FollowUpStatus,
  StockOpnamePeriod,
  StockOpnameRecord,
} from "../../types";

defineProps<{
  selectedPeriod?: StockOpnamePeriod;
  filtered: StockOpnameRecord[];
  recordsLoading: boolean;
  isLaboran: boolean;
  isHead: boolean;
  assetMap: Map<string, Asset>;
  conditionLabel: Record<string, string>;
  findingLabel: Record<FindingStatus, string>;
  followLabel: Record<FollowUpStatus, string>;
  formatDate: (value: string) => string;
  short: (value: string) => string;
}>();
const query = defineModel<string>("query", { default: "" });
const finding = defineModel<"all" | "open" | FindingStatus>("finding", {
  default: "all",
});
defineEmits<{
  inspect: [];
  "close-period": [];
  follow: [record: StockOpnameRecord];
}>();
</script>
