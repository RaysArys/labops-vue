<template>
  <article class="panel health">
    <div class="panel-title">
      <div>
        <h2>Kondisi sistem</h2>
        <p>Ringkasan operasional</p>
      </div>
    </div>
    <div class="health-ring">
      <strong>{{ scope }}<span>DATA SCOPE</span></strong>
    </div>
    <div class="health-row">
      <div>
        <span>Total aset</span><b>{{ totalAssets }}</b>
      </div>
      <div>
        <span>Perlu perhatian</span><b>{{ attentionCount }}</b>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  scope: string;
  totalAssets: number;
  attentionCount: number;
}>();
</script>
