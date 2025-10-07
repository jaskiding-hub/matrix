// Fungsi untuk membuat input matriks A sesuai ordo
function buatMatriksA() {
  const baris = Number.parseInt(document.getElementById("inputOrdoARow").value)
  const kolom = Number.parseInt(document.getElementById("inputOrdoACol").value)

  if (baris < 1 || kolom < 1 || baris > 10 || kolom > 10) {
    alert("Ordo harus antara 1 sampai 10")
    return
  }

  const area = document.getElementById("areaMatriksA")
  area.innerHTML = ""

  for (let i = 0; i < baris; i++) {
    const barisDiv = document.createElement("div")
    barisDiv.className = "baris-matriks"

    for (let j = 0; j < kolom; j++) {
      const input = document.createElement("input")
      input.type = "number"
      input.className = "input-elemen-matriks"
      input.id = `matriksA_${i}_${j}`
      input.value = "0"
      input.step = "any"
      barisDiv.appendChild(input)
    }

    area.appendChild(barisDiv)
  }
}

// Fungsi untuk membuat input matriks B sesuai ordo
function buatMatriksB() {
  const baris = Number.parseInt(document.getElementById("inputOrdoBRow").value)
  const kolom = Number.parseInt(document.getElementById("inputOrdoBCol").value)

  if (baris < 1 || kolom < 1 || baris > 10 || kolom > 10) {
    alert("Ordo harus antara 1 sampai 10")
    return
  }

  const area = document.getElementById("areaMatriksB")
  area.innerHTML = ""

  for (let i = 0; i < baris; i++) {
    const barisDiv = document.createElement("div")
    barisDiv.className = "baris-matriks"

    for (let j = 0; j < kolom; j++) {
      const input = document.createElement("input")
      input.type = "number"
      input.className = "input-elemen-matriks"
      input.id = `matriksB_${i}_${j}`
      input.value = "0"
      input.step = "any"
      barisDiv.appendChild(input)
    }

    area.appendChild(barisDiv)
  }
}

// Fungsi untuk membaca nilai matriks dari input ke array
function bacaMatriks(namaMatriks, baris, kolom) {
  const matriks = []

  for (let i = 0; i < baris; i++) {
    const barisArray = []
    for (let j = 0; j < kolom; j++) {
      const input = document.getElementById(`${namaMatriks}_${i}_${j}`)
      if (!input) {
        return null
      }
      barisArray.push(Number.parseFloat(input.value) || 0)
    }
    matriks.push(barisArray)
  }

  return matriks
}

// Fungsi untuk menampilkan pesan error
function tampilkanError(pesan) {
  const areaHasil = document.getElementById("areaHasil")
  areaHasil.innerHTML = `<div class="pesan-error">${pesan}</div>`
}

// Fungsi untuk menampilkan matriks hasil numerik
function tampilkanMatriks(matriks) {
  const areaHasil = document.getElementById("areaHasil")
  let html = '<div class="hasil-matriks">'

  for (let i = 0; i < matriks.length; i++) {
    html += '<div class="baris-hasil">'
    for (let j = 0; j < matriks[i].length; j++) {
      // Bulatkan ke 4 desimal untuk tampilan yang lebih rapi
      const nilai = Math.round(matriks[i][j] * 10000) / 10000
      html += `<div class="elemen-hasil">${nilai}</div>`
    }
    html += "</div>"
  }

  html += "</div>"
  areaHasil.innerHTML = html
}

// Helper function to convert decimal to fraction (continued fraction)
function kecanganPecahan(desimal) {
  const toleransi = 1.0e-6
  let h1 = 1,
    h2 = 0,
    k1 = 0,
    k2 = 1
  let b = desimal

  // jika desimal sangat kecil atau NaN, kembalikan 0/1
  if (!isFinite(b) || isNaN(b) || Math.abs(b) < Number.EPSILON) {
    return { pembilang: 0, penyebut: 1 }
  }

  do {
    const a = Math.floor(b)
    let aux = h1
    h1 = a * h1 + h2
    h2 = aux
    aux = k1
    k1 = a * k1 + k2
    k2 = aux
    b = 1 / (b - a)
  } while (Math.abs(desimal - h1 / k1) > desimal * toleransi && Math.abs(b) > toleransi)

  return { pembilang: h1, penyebut: k1 }
}

// Function to format number as fraction or integer nicely
function formatPecahan(angka) {
  if (Math.abs(angka) < 0.0000001) return "0"

  const negatif = angka < 0
  const nilaiAbs = Math.abs(angka)

  // Jika angka bulat
  if (Math.abs(nilaiAbs - Math.round(nilaiAbs)) < 0.0001) {
    return negatif ? `-${Math.round(nilaiAbs)}` : `${Math.round(nilaiAbs)}`
  }

  const pecahan = kecanganPecahan(nilaiAbs)
  const hasil = pecahan.penyebut === 1 ? `${pecahan.pembilang}` : `${pecahan.pembilang}/${pecahan.penyebut}`

  return negatif ? `-${hasil}` : hasil
}

function tampilkanMatriksPecahan(matriks) {
  let html = '<div class="hasil-matriks">'
  for (let i = 0; i < matriks.length; i++) {
    html += '<div class="baris-hasil">'
    for (let j = 0; j < matriks[i].length; j++) {
      html += `<div class="elemen-hasil">${formatPecahan(matriks[i][j])}</div>`
    }
    html += "</div>"
  }
  html += "</div>"
  return html
}

// Fungsi Perkalian Matriks (dengan langkah & rumus)
function hitungPerkalian() {
  const barisA = Number.parseInt(document.getElementById("inputOrdoARow").value)
  const kolomA = Number.parseInt(document.getElementById("inputOrdoACol").value)
  const barisB = Number.parseInt(document.getElementById("inputOrdoBRow").value)
  const kolomB = Number.parseInt(document.getElementById("inputOrdoBCol").value)

  if (kolomA !== barisB) {
    tampilkanError("Tidak memenuhi syarat<br>Kolom A harus sama dengan Baris B")
    return
  }

  const matriksA = bacaMatriks("matriksA", barisA, kolomA)
  const matriksB = bacaMatriks("matriksB", barisB, kolomB)

  if (!matriksA || !matriksB) {
    tampilkanError("Tidak memenuhi syarat<br>Silakan buat matriks terlebih dahulu")
    return
  }

  const areaHasil = document.getElementById("areaHasil")
  let html = '<div class="langkah-invers">'

  html += "<h3>Langkah-langkah Perkalian Matriks:</h3>"

  html += "<p><strong>1. Matriks A:</strong></p>"
  html += tampilkanMatriksPecahan(matriksA)

  html += "<p><strong>2. Matriks B:</strong></p>"
  html += tampilkanMatriksPecahan(matriksB)

  html += "<p><strong>3. Rumus perkalian matriks:</strong></p>"
  html += `<p>Jika A berordo ${barisA}×${kolomA} dan B berordo ${barisB}×${kolomB}, maka C = A × B berordo ${barisA}×${kolomB}.</p>`
  html += `<p>Elemen C[i][j] = Σ (A[i][k] × B[k][j]) untuk k = 1 sampai ${kolomA}.</p>`

  const hasil = []
  html += "<p><strong>4. Perhitungan setiap elemen:</strong></p>"

  for (let i = 0; i < barisA; i++) {
    hasil[i] = []
    for (let j = 0; j < kolomB; j++) {
      let sum = 0
      let perhitungan = `C[${i + 1}][${j + 1}] = `
      const langkah = []

      for (let k = 0; k < kolomA; k++) {
        sum += matriksA[i][k] * matriksB[k][j]
        langkah.push(`(${formatPecahan(matriksA[i][k])} × ${formatPecahan(matriksB[k][j])})`)
      }

      perhitungan += langkah.join(" + ") + ` = ${formatPecahan(sum)}`
      html += `<p>${perhitungan}</p>`
      hasil[i][j] = sum
    }
  }

  html += "<p><strong>5. Hasil akhir (A × B):</strong></p>"
  html += tampilkanMatriksPecahan(hasil)
  html += "</div>"

  areaHasil.innerHTML = html
}

// Fungsi untuk menghitung determinan matriks (rekursif menggunakan ekspansi kofaktor)
function hitungDeterminan(matriks) {
  const n = matriks.length

  // Base case: matriks 1x1
  if (n === 1) {
    return matriks[0][0]
  }

  // Base case: matriks 2x2
  if (n === 2) {
    return matriks[0][0] * matriks[1][1] - matriks[0][1] * matriks[1][0]
  }

  // Ekspansi kofaktor untuk matriks yang lebih besar
  let det = 0
  for (let j = 0; j < n; j++) {
    det += Math.pow(-1, j) * matriks[0][j] * hitungDeterminan(getMinor(matriks, 0, j))
  }

  return det
}

// Fungsi untuk mendapatkan minor matriks (menghapus baris i dan kolom j)
function getMinor(matriks, barisHapus, kolomHapus) {
  const minor = []
  for (let i = 0; i < matriks.length; i++) {
    if (i === barisHapus) continue
    const baris = []
    for (let j = 0; j < matriks[i].length; j++) {
      if (j === kolomHapus) continue
      baris.push(matriks[i][j])
    }
    minor.push(baris)
  }
  return minor
}

// Fungsi hitung determinan untuk Matriks A (menampilkan langkah/rumus)
function hitungDeterminanA() {
  const baris = Number.parseInt(document.getElementById("inputOrdoARow").value)
  const kolom = Number.parseInt(document.getElementById("inputOrdoACol").value)

  if (baris !== kolom) {
    tampilkanError("Tidak memenuhi syarat<br>Determinan hanya untuk matriks persegi")
    return
  }

  const matriks = bacaMatriks("matriksA", baris, kolom)

  if (!matriks) {
    tampilkanError("Tidak memenuhi syarat<br>Silakan buat matriks terlebih dahulu")
    return
  }

  const areaHasil = document.getElementById("areaHasil")
  let html = '<div class="langkah-invers">'

  html += "<h3>Langkah-langkah Perhitungan Determinan:</h3>"

  html += "<p><strong>1. Matriks A:</strong></p>"
  html += tampilkanMatriksPecahan(matriks)

  if (baris === 2) {
    html += "<p><strong>2. Rumus determinan 2×2:</strong></p>"
    html += "<p>det(A) = ad - bc</p>"

    const a = matriks[0][0],
      b = matriks[0][1]
    const c = matriks[1][0],
      d = matriks[1][1]

    html += "<p><strong>3. Perhitungan:</strong></p>"
    html += `<p>det(A) = (${formatPecahan(a)})(${formatPecahan(d)}) - (${formatPecahan(b)})(${formatPecahan(c)})</p>`
    html += `<p>det(A) = ${formatPecahan(a * d)} - ${formatPecahan(b * c)}</p>`

    const det = hitungDeterminan(matriks)
    html += `<p><strong>4. Hasil:</strong> det(A) = ${formatPecahan(det)}</p>`
  } else if (baris === 3) {
    html += "<p><strong>2. Rumus determinan 3×3 (ekspansi baris pertama):</strong></p>"
    html += "<p>det(A) = a₁₁C₁₁ + a₁₂C₁₂ + a₁₃C₁₃, dengan Cᵢⱼ = (-1)^{i+j} det(Mᵢⱼ)</p>"

    html += "<p><strong>3. Perhitungan kofaktor:</strong></p>"
    for (let j = 0; j < 3; j++) {
      const minor = getMinor(matriks, 0, j)
      const detMinor = hitungDeterminan(minor)
      const kofaktor = Math.pow(-1, j) * detMinor
      html += `<p>C₁${j + 1} = ${j % 2 === 0 ? "+" : "-"}det(M₁${j + 1}) = ${formatPecahan(kofaktor)}</p>`
      html += `<p>det(M₁${j + 1}) = ${formatPecahan(detMinor)}</p>`
    }

    const det = hitungDeterminan(matriks)
    html += `<p><strong>4. Hasil akhir:</strong> det(A) = ${formatPecahan(det)}</p>`
  } else {
    html += "<p><strong>2. Metode:</strong></p>"
    html += "<p>Menggunakan ekspansi kofaktor baris pertama (umum untuk n×n)</p>"

    const det = hitungDeterminan(matriks)
    html += `<p><strong>3. Hasil akhir:</strong> det(A) = ${formatPecahan(det)}</p>`
  }

  html += "</div>"
  areaHasil.innerHTML = html
}

// Fungsi hitung determinan untuk Matriks B (menampilkan langkah/rumus)
function hitungDeterminanB() {
  const baris = Number.parseInt(document.getElementById("inputOrdoBRow").value)
  const kolom = Number.parseInt(document.getElementById("inputOrdoBCol").value)

  if (baris !== kolom) {
    tampilkanError("Tidak memenuhi syarat<br>Determinan hanya untuk matriks persegi")
    return
  }

  const matriks = bacaMatriks("matriksB", baris, kolom)

  if (!matriks) {
    tampilkanError("Tidak memenuhi syarat<br>Silakan buat matriks terlebih dahulu")
    return
  }

  const areaHasil = document.getElementById("areaHasil")
  let html = '<div class="langkah-invers">'

  html += "<h3>Langkah-langkah Perhitungan Determinan:</h3>"

  html += "<p><strong>1. Matriks B:</strong></p>"
  html += tampilkanMatriksPecahan(matriks)

  if (baris === 2) {
    html += "<p><strong>2. Rumus determinan 2×2:</strong></p>"
    html += "<p>det(B) = ad - bc</p>"

    const a = matriks[0][0],
      b = matriks[0][1]
    const c = matriks[1][0],
      d = matriks[1][1]

    html += "<p><strong>3. Perhitungan:</strong></p>"
    html += `<p>det(B) = (${formatPecahan(a)})(${formatPecahan(d)}) - (${formatPecahan(b)})(${formatPecahan(c)})</p>`
    html += `<p>det(B) = ${formatPecahan(a * d)} - ${formatPecahan(b * c)}</p>`

    const det = hitungDeterminan(matriks)
    html += `<p><strong>4. Hasil:</strong> det(B) = ${formatPecahan(det)}</p>`
  } else if (baris === 3) {
    html += "<p><strong>2. Rumus determinan 3×3 (ekspansi baris pertama):</strong></p>"
    html += "<p>det(B) = b₁₁C₁₁ + b₁₂C₁₂ + b₁₃C₁₃, dengan Cᵢⱼ = (-1)^{i+j} det(Mᵢⱼ)</p>"

    html += "<p><strong>3. Perhitungan kofaktor:</strong></p>"
    for (let j = 0; j < 3; j++) {
      const minor = getMinor(matriks, 0, j)
      const detMinor = hitungDeterminan(minor)
      const kofaktor = Math.pow(-1, j) * detMinor
      html += `<p>C₁${j + 1} = ${j % 2 === 0 ? "+" : "-"}det(M₁${j + 1}) = ${formatPecahan(kofaktor)}</p>`
      html += `<p>det(M₁${j + 1}) = ${formatPecahan(detMinor)}</p>`
    }

    const det = hitungDeterminan(matriks)
    html += `<p><strong>4. Hasil akhir:</strong> det(B) = ${formatPecahan(det)}</p>`
  } else {
    html += "<p><strong>2. Metode:</strong></p>"
    html += "<p>Menggunakan ekspansi kofaktor baris pertama (umum untuk n×n)</p>"

    const det = hitungDeterminan(matriks)
    html += `<p><strong>3. Hasil akhir:</strong> det(B) = ${formatPecahan(det)}</p>`
  }

  html += "</div>"
  areaHasil.innerHTML = html
}

// Fungsi untuk mendapatkan matriks kofaktor
function getKofaktor(matriks) {
  const n = matriks.length
  const kofaktor = []

  for (let i = 0; i < n; i++) {
    kofaktor[i] = []
    for (let j = 0; j < n; j++) {
      const minor = getMinor(matriks, i, j)
      kofaktor[i][j] = Math.pow(-1, i + j) * hitungDeterminan(minor)
    }
  }

  return kofaktor
}

// Fungsi untuk transpose matriks (mengasumsikan matriks persegi)
function transpose(matriks) {
  const n = matriks.length
  const hasil = []

  for (let i = 0; i < n; i++) {
    hasil[i] = []
    for (let j = 0; j < n; j++) {
      hasil[i][j] = matriks[j][i]
    }
  }

  return hasil
}

// Fungsi untuk menghitung invers matriks menggunakan metode adjugate
function hitungInvers(matriks) {
  const n = matriks.length
  const det = hitungDeterminan(matriks)

  // Jika determinan = 0, matriks tidak memiliki invers
  if (Math.abs(det) < 0.0000001) {
    return null
  }

  // Untuk matriks 1x1
  if (n === 1) {
    return [[1 / matriks[0][0]]]
  }

  // Hitung matriks kofaktor
  const kofaktor = getKofaktor(matriks)

  // Transpose kofaktor untuk mendapatkan adjugate
  const adjugate = transpose(kofaktor)

  // Bagi setiap elemen dengan determinan
  const invers = []
  for (let i = 0; i < n; i++) {
    invers[i] = []
    for (let j = 0; j < n; j++) {
      invers[i][j] = adjugate[i][j] / det
    }
  }

  return invers
}

// Tampilan lengkap langkah invers (pembetulan: pakai <div> agar baris tampil rapi)
function tampilkanInversLengkap(matriks, namaMatriks) {
  const n = matriks.length
  const det = hitungDeterminan(matriks)

  const areaHasil = document.getElementById("areaHasil")
  let html = '<div class="langkah-invers">'

  if (n === 2) {
    const a = matriks[0][0]
    const b = matriks[0][1]
    const c = matriks[1][0]
    const d = matriks[1][1]

    html += "<h3>Langkah-langkah Perhitungan Invers:</h3>"
    html += "<p><strong>1. Rumus invers matriks 2×2:</strong></p>"
    html += "<p>A⁻¹ = 1/(ad - bc) × [d  -b; -c  a]</p>"

    html += "<p><strong>2. Nilai elemen matriks:</strong></p>"
    html += `<p>a = ${formatPecahan(a)}, b = ${formatPecahan(b)}, c = ${formatPecahan(c)}, d = ${formatPecahan(d)}</p>`

    html += "<p><strong>3. Hitung determinan:</strong></p>"
    html += `<p>det(${namaMatriks}) = ad - bc = (${formatPecahan(a)})(${formatPecahan(d)}) - (${formatPecahan(b)})(${formatPecahan(c)})</p>`
    html += `<p>det(${namaMatriks}) = ${formatPecahan(a * d)} - ${formatPecahan(b * c)} = ${formatPecahan(det)}</p>`

    if (Math.abs(det) < 0.0000001) {
      html += '<p class="pesan-error">Determinan = 0, matriks tidak memiliki invers</p>'
      html += "</div>"
      areaHasil.innerHTML = html
      return
    }

    html += "<p><strong>4. Hasil akhir:</strong></p>"
    const adjugate = [
      [d, -b],
      [-c, a],
    ]
    html += `<div>${namaMatriks}⁻¹ = 1/${formatPecahan(det)} ×</div>`
    html += tampilkanMatriksPecahan(adjugate)
  } else {
    html += "<h3>Langkah-langkah Perhitungan Invers:</h3>"

    html += "<p><strong>1. Matriks awal:</strong></p>"
    html += tampilkanMatriksPecahan(matriks)

    html += "<p><strong>2. Hitung determinan:</strong></p>"
    html += `<p>det(${namaMatriks}) = ${formatPecahan(det)}</p>`

    if (Math.abs(det) < 0.0000001) {
      html += '<p class="pesan-error">Determinan = 0, matriks tidak memiliki invers</p>'
      html += "</div>"
      areaHasil.innerHTML = html
      return
    }

    html += "<p><strong>3. Hitung matriks kofaktor:</strong></p>"
    const kofaktor = getKofaktor(matriks)
    html += tampilkanMatriksPecahan(kofaktor)

    html += "<p><strong>4. Transpose kofaktor (Adjugate):</strong></p>"
    const adjugate = transpose(kofaktor)
    html += tampilkanMatriksPecahan(adjugate)

    html += "<p><strong>5. Hasil akhir:</strong></p>"
    html += `<div>${namaMatriks}⁻¹ = 1/${formatPecahan(det)} ×</div>`
    html += tampilkanMatriksPecahan(adjugate)
  }

  html += "</div>"
  areaHasil.innerHTML = html
}

function hitungInversA() {
  const baris = Number.parseInt(document.getElementById("inputOrdoARow").value)
  const kolom = Number.parseInt(document.getElementById("inputOrdoACol").value)

  if (baris !== kolom) {
    tampilkanError("Tidak memenuhi syarat<br>Invers hanya untuk matriks persegi")
    return
  }

  const matriks = bacaMatriks("matriksA", baris, kolom)

  if (!matriks) {
    tampilkanError("Tidak memenuhi syarat<br>Silakan buat matriks terlebih dahulu")
    return
  }

  tampilkanInversLengkap(matriks, "A")
}

function hitungInversB() {
  const baris = Number.parseInt(document.getElementById("inputOrdoBRow").value)
  const kolom = Number.parseInt(document.getElementById("inputOrdoBCol").value)

  if (baris !== kolom) {
    tampilkanError("Tidak memenuhi syarat<br>Invers hanya untuk matriks persegi")
    return
  }

  const matriks = bacaMatriks("matriksB", baris, kolom)

  if (!matriks) {
    tampilkanError("Tidak memenuhi syarat<br>Silakan buat matriks terlebih dahulu")
    return
  }

  tampilkanInversLengkap(matriks, "B")
}

// Inisialisasi matriks default saat halaman dimuat
window.onload = () => {
  buatMatriksA()
  buatMatriksB()
}
