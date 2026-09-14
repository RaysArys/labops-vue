<template>
  <div class="page">
    <header class="page-heading">
      <div>
        <span class="eyebrow">VERIFIKASI INVENTARIS</span>
        <h1>Stock opname</h1>
        <p>
          {{
            isLaboran
              ? "Periksa keberadaan, lokasi, jumlah, dan kondisi fisik aset."
              : "Pantau periode dan tindak lanjuti setiap temuan."
          }}
        </p>
      </div>
      <button class="btn primary" @click="periodModal = true">
        ＋ Buka periode
      </button>
    </header>

    <div v-if="notice" class="alert success">
      {{ notice }}<button type="button" @click="notice = ''">×</button>
    </div>
    <div v-if="error" class="alert danger">
      {{ error }}<button type="button" @click="error = ''">×</button>
    </div>

    <section class="stats-grid">
      <StatCard
        label="Total diperiksa"
        :value="records.length"
        hint="Periode terpilih"
        icon="☷"
      />
      <StatCard
        label="Sesuai"
        :value="findingCount('sesuai')"
        hint="Data cocok"
        icon="✓"
      />
      <StatCard
        label="Temuan"
        :value="
          records.filter((record) => record.status_temuan !== 'sesuai').length
        "
        hint="Perlu diperiksa"
        icon="!"
      />
      <StatCard
        label="Aset rusak"
        :value="
          records.filter((record) => record.kondisi_fisik === 'rusak').length
        "
        hint="Work order otomatis"
        icon="⌁"
        tone="danger"
      />
    </section>

    <section class="opname-workspace">
      <PeriodList
        :periods="periods"
        :selected-id="selectedPeriodId"
        :loading="loading"
        :format-date="date"
        @select="selectPeriod"
      />
      <RecordsPanel
        v-model:query="query"
        v-model:finding="finding"
        :selected-period="selectedPeriod"
        :filtered="filtered"
        :records-loading="recordsLoading"
        :is-laboran="isLaboran"
        :is-head="isHead"
        :asset-map="assetMap"
        :condition-label="conditionLabel"
        :finding-label="findingLabel"
        :follow-label="followLabel"
        :format-date="date"
        :short="short"
        @inspect="inspectionModal = true"
        @close-period="closePeriod"
        @follow="openFollow"
      />
    </section>

    <StockOpnameModals
      v-model:inspection-tab="inspectionTab"
      v-model:asset-search="assetSearch"
      :period-open="periodModal"
      :inspection-open="inspectionModal"
      :busy="busy"
      :search-results="searchResults"
      :inspection="inspection"
      :new-asset="newAsset"
      :period-form="periodForm"
      :follow-record="followRecord"
      :follow-form="followForm"
      :asset-map="assetMap"
      :condition-label="conditionLabel"
      :category-label="categoryLabel"
      :follow-label="followLabel"
      :short="short"
      @close-period-modal="periodModal = false"
      @open-period="openPeriod"
      @close-inspection-modal="inspectionModal = false"
      @inspect="inspect"
      @search-assets="searchAssets"
      @register-new="registerNew"
      @close-follow="followRecord = null"
      @save-follow="saveFollow"
    />
  </div>
</template>

<script setup lang="ts">
import { StatCard } from "../components/ui";
import PeriodList from "../components/stock-opname/PeriodList.vue";
import RecordsPanel from "../components/stock-opname/RecordsPanel.vue";
import StockOpnameModals from "../components/stock-opname/StockOpnameModals.vue";
import { useStockOpname } from "../composables/useStockOpname";

const {
  isLaboran,
  isHead,
  conditionLabel,
  findingLabel,
  followLabel,
  categoryLabel,
  periods,
  records,
  selectedPeriodId,
  loading,
  recordsLoading,
  busy,
  error,
  notice,
  query,
  finding,
  periodModal,
  inspectionModal,
  inspectionTab,
  assetSearch,
  searchResults,
  followRecord,
  periodForm,
  inspection,
  newAsset,
  followForm,
  selectedPeriod,
  assetMap,
  filtered,
  findingCount,
  selectPeriod,
  openPeriod,
  closePeriod,
  searchAssets,
  inspect,
  registerNew,
  openFollow,
  saveFollow,
  short,
  date,
} = useStockOpname();
</script>
