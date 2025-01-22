// Ambil data pasien dari server
function ambilData() {
  axios
    .get("http://localhost:3000/pasien")
    .then((response) => {
      const pasien = response.data;
      let output = "";

      if (pasien.length > 0) {
        pasien.forEach((p, index) => {
          output += `
            <tr>
              <td>${index + 1}</td>
              <td>${p.bpjs}</td>
              <td>${p.nik}</td>
              <td>${p.nama}</td>
              <td>${p.tanggal_lahir}</td>
              <td>${p.alamat}</td>
              <td>
                <button id="btnEdit" onclick="editData('${p.id}', '${p.bpjs}', '${p.nik}', '${p.nama}', '${p.tanggal_lahir}', '${p.alamat}')">Edit</button>
                <button id="btnHapus" onclick="hapusData('${p.id}')">Hapus</button>
              </td>
            </tr>
          `;
        });
      } else {
        output = `
          <tr>
            <td colspan="7">Data tidak ditemukan</td>
          </tr>
        `;
      }

      document.getElementById("hasil").innerHTML = output;
    })
    .catch((error) => {
      console.error("Error fetching data:", error.message);
    });
}


// Simpan data baru atau update data
function simpanData() {
  const bpjs = document.getElementById("bpjs").value;
  const nik = document.getElementById("nik").value;
  const nama = document.getElementById("nama").value;
  const tanggalLahir = document.getElementById("tanggalLahir").value;
  const alamat = document.getElementById("alamat").value;
  
  // Validasi input
  if (!bpjs || !nik || !nama || !tanggalLahir || !alamat) {
    Swal.fire("Harap isi semua data!");
    return;
  }

  // Periksa apakah tombol Simpan berubah menjadi Update (artinya sedang dalam mode edit)
  const btnSimpan = document.getElementById("btnSimpan");
  const id = btnSimpan.getAttribute("data-id"); // Cek apakah ada ID yang disimpan

  if (id) {
    // Jika ada ID, lakukan update data
    updateData(id, bpjs, nik, nama, tanggalLahir, alamat);
  } else {
    // Jika tidak ada ID, lakukan penyimpanan data baru
    Swal.fire({
      title: "Konfirmasi Penyimpanan",
      text: "Apakah Anda yakin ingin menyimpan data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("http://localhost:3000/pasien", {
            bpjs,
            nik,
            nama,
            tanggal_lahir: tanggalLahir,
            alamat,
          })
          .then(() => {
            Swal.fire("Data berhasil disimpan!");
            ambilData(); // Refresh data setelah penyimpanan
          })
          .catch((error) => {
            console.error("Error saving data:", error.message);
          });
      } else {
        Swal.fire("Penyimpanan dibatalkan.");
      }
    });
  }
}

// Update data
function updateData(id, bpjs, nik, nama, tanggalLahir, alamat) {
  // Tampilkan konfirmasi perubahan menggunakan SweetAlert2
  Swal.fire({
    title: "Konfirmasi Perubahan",
    text: "Apakah Anda yakin ingin memperbarui data ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, update",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika user mengklik "Ya", lakukan update
      axios
        .patch(`http://localhost:3000/pasien/${id}`, {
          bpjs,
          nik,
          nama,
          tanggal_lahir: tanggalLahir,
          alamat,
        })
        .then(() => {
          Swal.fire("Data berhasil diperbarui!");
          resetInput(); // Membersihkan input setelah update
          ambilData();  // Reload data dari server
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    } else {
      // Jika user memilih "Batal", tampilkan pesan pembatalan
      Swal.fire("Perubahan dibatalkan.");
    }
  });
}

// Edit data
function editData(id, bpjs, nik, nama, tanggalLahir, alamat) {
  // Tampilkan dialog konfirmasi menggunakan SweetAlert2
  Swal.fire({
    title: "Edit data?",
    text: "Anda yakin ingin mengubah data ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, edit",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika user mengklik "Ya", masukkan data ke dalam form
      document.getElementById("bpjs").value = bpjs;
      document.getElementById("nik").value = nik;
      document.getElementById("nama").value = nama;
      document.getElementById("tanggalLahir").value = tanggalLahir;
      document.getElementById("alamat").value = alamat;

      // Ubah tombol menjadi Update
      const btnSimpan = document.getElementById("btnSimpan");
      btnSimpan.innerText = "Update";
      btnSimpan.setAttribute("data-id", id); // Simpan ID untuk Update
    } else {
      // Jika user membatalkan, tampilkan pesan pembatalan
      Swal.fire("Perubahan dibatalkan.");
    }
  });
}


// Hapus data
function hapusData(id) {
  Swal.fire({
    title: "Yakin ingin menghapus data ini?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`http://localhost:3000/pasien/${id}`)
        .then(() => {
          Swal.fire("Data berhasil dihapus!");
          ambilData();
        })
        .catch((error) => {
          console.error("Error deleting data:", error.message);
        });
    }
  });
}

// Reset form input
function resetInput() {
  document.getElementById("bpjs").value = '';
  document.getElementById("nik").value = '';
  document.getElementById("nama").value = '';
  document.getElementById("tanggalLahir").value = '';
  document.getElementById("alamat").value = '';
  
  const btnSimpan = document.getElementById("btnSimpan");
  btnSimpan.innerText = "Simpan";
  btnSimpan.removeAttribute("data-id");
}

function layaniPasien(id) {
  window.location.href = `layani.html?id=${id}`;
}

// Jalankan fungsi ambil data
ambilData();


