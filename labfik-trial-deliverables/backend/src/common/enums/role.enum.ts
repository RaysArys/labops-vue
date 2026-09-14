// Lima peran pengguna sistem, sesuai SRS.
// Nilai enum ini dipakai sebagai claim "role" baik di token JWT lokal
// maupun (nanti) di-mapping dari Realm Role Keycloak.
export enum Role {
  TEKNISI = 'teknisi',
  LABORAN = 'laboran',
  KEPALA_LAB = 'kepala_lab',
  TATA_USAHA = 'tata_usaha',
  WAKIL_DEKAN = 'wakil_dekan',
}
