let questions = [
  {
    question: "Apa fungsi dari elemen HTML <p>", 
    option1: "Menentukan gaya CSS untuk elemen.",
    option2: "Membuat dan menginisialisasi objek",
    option3: "Mengelola koneksi database",
    option4: "Sebagai pondasi utama dalam pembuatan website",
    answer: "Sebagai pondasi utama dalam pembuatan website",
  },
  {
    question: "Kata kunci apa yang digunakan untuk membuat judul di HTML?",
    option1: "this",
    option2: "new",
    option3: "create",
    option4: "h1",
    answer: "h1",
  },
  {
    question:
      "Apa yang dimaksud dengan kata kunci 'src' dalam elemen <img> di HTML?",
    option1: "Sumber gambar.",
    option2: "Objek prototype dari konstruktor.",
    option3: "Alamat URL saat ini.",
    option4: "Kata kunci yang sudah dipesan tanpa makna khusus.",
    answer: "Sumber gambar.",
  },
  {
    question: "Apa tujuan dari atribut 'href' dalam elemen <a> di HTML?",
    option1: "Mendefinisikan nama konstruktor.",
    option2: "Menyimpan data pribadi untuk objek.",
    option3: "Menambahkan metode dan properti ke semua instansi objek.",
    option4: "Menentukan URL tujuan tautan.",
    answer: "Menentukan URL tujuan tautan.",
  },
  {
    question:
      "Bagaimana cara menambahkan warna latar belakang pada elemen HTML?",
    option1: "Menggunakan notasi 'dot' (contohnya, obj.property).",
    option2: "Dengan memanggil fungsi terpisah dengan nama properti.",
    option3:
      "Dengan menggunakan atribut 'style' dan properti 'background-color'.",
    option4: "Dengan menggunakan properti 'prototype' dari konstruktor.",
    answer:
      "Dengan menggunakan atribut 'style' dan properti 'background-color'.",
  },
];

var startBtn = document.querySelector(".startBtn");
var login_form = document.querySelector(".login_form");
var emailPass = document.querySelector(".emailPass");
var hideBtn = document.querySelector(".hideBtn");
var userEmail = document.getElementById("uEmail");
var userPass = document.getElementById("uPass");
var infoBox = document.querySelector(".info_box");
var quizStart = document.querySelector(".quiz_container");
var resultbox = document.querySelector(".result_box");
var scoreText = document.querySelector(".score_text");
var countDown = document.getElementById("timer");

var index = 0; // Menghitung posisi Soal
var score = 0; // Skor Kuis
var counter; // Waktu Timer
var timeValue = 15; // Timer per soal disesuaikan info HTML

// Ambil inputan register
let signUpName = document.getElementById("sName");
let signUpEmail = document.getElementById("sEmail");
let signUppass = document.getElementById("sPass");

// Register Form - ditambahkan penangkap 'event'
function submitForm(event) {
  event.preventDefault();
  let registerUser = {
    name: signUpName.value,
    email: signUpEmail.value,
    pass: signUppass.value,
  };
  localStorage.setItem("registerUser", JSON.stringify(registerUser));
  
  // Berikan feedback visual
  Swal.fire({
    icon: 'success',
    title: 'Berhasil Registrasi',
    text: 'Silahkan Login',
    timer: 1500,
    showConfirmButton: false
  }).then(() => {
    window.location.href = "./index.html";
  });
}

// Login Form
function loginForm() {
  // Ambil data dari local storage langsung agar update
  let getUserData = JSON.parse(localStorage.getItem("registerUser"));

  if (!getUserData) {
    const Toast = Swal.mixin({ toast: true, position: "top" });
    Toast.fire({
      icon: "info",
      title: "Belum ada data! Silahkan daftarkan akun anda",
    });
    return; // Berhenti di sini
  }

  // Cek kesesuaian email dan password
  if (userEmail.value == getUserData.email && userPass.value == getUserData.pass) {
    infoBox.style.display = "block";
    login_form.style.display = "none";
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 2000,
    });
    Toast.fire({ icon: "success", title: "Berhasil Masuk" });
  } else {
    const Toast = Swal.mixin({ toast: true, position: "top", showConfirmButton: false, timer: 1500 });
    Toast.fire({ icon: "warning", title: "Email atau Password Salah!" });
  }
}

// Keluar kuis
function quit() {
  location.reload();
}

// Masuk kuis dari Info Box
function enterQuiz() {
  infoBox.style.display = "none";
  startBtn.style.display = "block";
}

// Sistem Diskualifikasi jika keluar tab (Dipindah ke luar renderQuestions)
window.addEventListener("blur", () => {
  if (quizStart.style.display === "block") { // Pastikan kuis sedang berjalan
    clearInterval(counter);
    resultbox.style.display = "flex";
    quizStart.style.display = "none";
    scoreText.innerHTML = `
      <span style="text-align: center; margin: 15px 0; font-size: 18px; color: #ff3b3b; font-weight: bold;">
      Anda membuka tab/layar lain. Kuis Anda Didiskualifikasi! 🖐️</span>`;
    document.querySelector(".circular-progress").style.display = "none";
  }
});

// Tampilkan & Cek Pertanyaan
function renderQuestions() {
  var question = document.getElementById("qustionsContainer");
  var options = document.getElementsByName("options");
  var qustionNo = document.getElementById("qustionNo");

  // Periksa jawaban SEBELUMNYA hanya jika sudah melewati soal pertama (index > 0)
  if (index > 0) {
    for (var i = 0; i < options.length; i++) {
      if (options[i].checked) {
        if (options[i].value === questions[index - 1].answer) {
          score++;
        }
      }
    }
  }

  // Jika semua pertanyaan sudah selesai dijawab
  if (index >= questions.length) {
    clearInterval(counter);
    resultbox.style.display = "flex";
    quizStart.style.display = "none";

    scoreText.innerHTML = `<span>Skor Anda: <p>${score}</p> dari <p>${questions.length}</p></span>`;

    var circularProgress = document.querySelector(".circular-progress");
    var progressValue = document.querySelector(".progress-value");
    
    var percentage = (score / questions.length) * 100;
    var progressStartValue = 0;
    var progressEndValue = Math.round(percentage);
    
    // Perbaikan animasi jika nilai 0
    if(progressEndValue === 0) {
        progressValue.textContent = "0%";
        return;
    }

    var progress = setInterval(() => {
      progressStartValue++;
      progressValue.textContent = `${progressStartValue}%`;
      circularProgress.style.background = `conic-gradient(var(--primaryColor) ${
        progressStartValue * 3.6
      }deg, #ededed 0deg)`;

      if (progressStartValue == progressEndValue) {
        clearInterval(progress);
      }
    }, 25);
    return;
  }

  // Bersihkan dan mulai timer untuk soal selanjutnya
  clearInterval(counter);
  startTimer(timeValue);

  var number = index + 1;
  var questionValue = questions[index];
  
  // Merender soal ke layar (Diubah menjadi input TYPE="RADIO" agar hanya 1 jawaban yang terpilih)
  question.innerHTML = `
        <div id="qustions">
            <span>${number}. </span>
            <p style="margin-left: 10px">${questionValue.question}</p>
        </div>
        <div class="options_list">
            <label for="options1" class="options"><input type="radio" id="options1" name="options" value="${questionValue.option1}">${questionValue.option1}<span class="checkmark"></span></label>
            <label for="options2" class="options"><input type="radio" id="options2" name="options" value="${questionValue.option2}">${questionValue.option2}<span class="checkmark"></span></label>
            <label for="options3" class="options"><input type="radio" id="options3" name="options" value="${questionValue.option3}">${questionValue.option3}<span class="checkmark"></span></label>
            <label for="options4" class="options"><input type="radio" id="options4" name="options" value="${questionValue.option4}">${questionValue.option4}<span class="checkmark"></span></label>
        </div>
    `;

  index++;
  qustionNo.innerHTML = index;
}

// Timer Controller
function startTimer(time) {
  countDown.textContent = time;
  counter = setInterval(() => {
    time--;
    countDown.textContent = time;
    if (time < 0) {
      clearInterval(counter);
      renderQuestions(); // Lanjut otomatis jika waktu habis
    }
  }, 1000);
}

// Start kuis button dipencet
function startQuiz() {
  quizStart.style.display = "block";
  startBtn.style.display = "none";
  renderQuestions();

  // Full Screen Request (Anti-cheat)
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(e => console.log(e));
  }
}