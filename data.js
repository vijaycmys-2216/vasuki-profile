/* ============================================================
   Profile data — sourced from the public Google Scholar profile
   https://scholar.google.com/citations?user=9Ucx9csAAAAJ
   Retrieved 2026-08-25. Citation counts are a snapshot.
   ============================================================ */

var PROFILE = {
  name: 'K. R. Vasuki',
  title: 'Senior Professor of Mathematics',
  dept: 'Department of Studies in Mathematics',
  org: 'University of Mysore',
  address: ['Manasagangotri', 'Mysuru 570 006, Karnataka', 'India'],
  scholar: 'https://scholar.google.com/citations?hl=en&user=9Ucx9csAAAAJ',
  researchgate: 'https://www.researchgate.net/profile/K-Vasuki',
  interests: ['Special Functions', 'Number Theory'],
  metrics: [
    { label: 'Citations',  all: 481, recent: 169 },
    { label: 'h-index',    all: 12,  recent: 6 },
    { label: 'i10-index',  all: 19,  recent: 5 }
  ]
};

/* Some venues get indexed under more than one spelling — an "&" vs "and", a
   standard abbreviation, a trailing parenthetical, or (for the Ukrainian
   journal) its transliterated original-language name alongside the English
   Springer translation. venueName() below maps every key to its value so
   they group as one venue instead of splitting the count across several
   "Frequent Venues" entries.

   "Math. Forum" and "Mathematical Forum" below ARE merged with each other
   (same small regional journal, vol. 12–13, 1998–2000) but deliberately
   NOT with "International Mathematical Forum" (Hikari Ltd., vol. 5, 2010)
   despite the similar name — the volumes and years don't line up, so it's
   a different journal and is left alone. */
var VENUE_ALIASES = {
  'Indian Journal of Pure & Applied Mathematics': 'Indian Journal of Pure and Applied Mathematics',

  'South East Asian Journal of Mathematics & Mathematical Sciences': 'South East Asian Journal of Mathematics and Mathematical Sciences',
  'South East J. Math. Math. Soc.': 'South East Asian Journal of Mathematics and Mathematical Sciences',

  'The Journal of the Indian Mathematical Society': 'Journal of the Indian Mathematical Society',
  'J. Indian Math. Soc.': 'Journal of the Indian Mathematical Society',

  'Advanced Studies in Contemporary Mathematics (Kyungshang)': 'Advanced Studies in Contemporary Mathematics',

  'International J. Math. Combin.': 'International Journal of Mathematical Combinatorics',
  'Mathematical Combinatorics': 'International Journal of Mathematical Combinatorics',

  'Math. Forum': 'Mathematical Forum',

  'Ukrains\u2019kyi Matematychnyi Zhurnal': 'Ukrainian Mathematical Journal',
  "Ukrains'kyi Matematychnyi Zhurnal": 'Ukrainian Mathematical Journal'
};

/* Manually maintained, like the metrics above — edit by hand when it changes. */
var EDUCATION = [
  {
    year: '2001',
    degree: 'Ph.D. in Mathematics',
    place: 'Department of Studies in Mathematics, University of Mysore, Manasagangotri, Mysore',
    detail: 'Thesis: “Some Studies in the Theory of Special Functions and Number Theory” · Research supervisor: Prof. Chandrashekar Adiga'
  },
  {
    year: '1995',
    degree: 'M.Sc. in Mathematics',
    place: 'Department of Studies in Mathematics, University of Mysore, Manasagangotri, Mysore',
    detail: 'First Class'
  },
  {
    year: '1993',
    degree: 'B.Sc.',
    place: 'Sarada Vilas College, University of Mysore',
    detail: 'First Class'
  }
];

/* Ph.D. research supervisor. Photo path matches the collaborator avatar for
   "C Adiga" (assets/collab/c-adiga.jpg) — the same file covers both spots. */
var GUIDE = {
  name: 'Prof. Chandrashekar Adiga',
  role: 'Senior Professor · Ph.D. Research Supervisor · Department of Studies in Mathematics, University of Mysore',
  photo: 'assets/collab/c-adiga.jpg',
  scholar: 'https://scholar.google.com/citations?user=-Ao2T1kAAAAJ&hl=en',
  bio: 'Prof. Adiga supervised K. R. Vasuki’s doctoral research, completed in 2001. A specialist in special functions, number theory, and the mathematics of Srinivasa Ramanujan, he authored more than ninety research papers over his career and supervised several doctoral students at the department. Prof. Adiga passed away in August 2024.'
};

/* Ph.D. awardees supervised by K. R. Vasuki, with year of award. */
var PHD_STUDENTS = [
  { name: 'T. G. Sreeramamurthy',   year: 2008, role: 'Professor (Retd.), Acharya Institute of Management and Science, Bangalore' },
  { name: 'B. R. Srivatsa Kumar',   year: 2008, role: 'Professor, Manipal Institute of Technology, Manipal' },
  { name: 'K. R. Rajanna',          year: 2009, role: 'Professor, Acharya Institute of Technology, Bangalore' },
  { name: 'N. Bhaskara',            year: 2009, role: 'Professor (Retd.), Vidyavardhaka College of Engineering, Mysore' },
  { name: 'Abdulrawf A. A. Kahtan', year: 2010, role: '' },
  { name: 'C. Chamaraju',           year: 2011, role: 'Professor (Retd.), SJCE, Mysore' },
  { name: 'G. Sharath',             year: 2012, role: 'Assistant Professor, PES College of Engineering, Mandya' },
  { name: 'Khaled A. A. Alloush',   year: 2013, role: '' },
  { name: 'R. G. Veeresha',         year: 2015, role: 'Associate Professor, SJCE, Mysore' },
  { name: 'Bhuvan E. Nalige',       year: 2018, role: 'Assistant Professor, NIE, Mysore' },
  { name: 'T. Anusha',              year: 2019, role: 'Azim Premji University, Bangalore' },
  { name: 'Mahadevaswamy',          year: 2020, role: 'Assistant Professor, SJCE, Mysore' },
  { name: 'K. Pushpa',              year: 2022, role: 'Assistant Professor, Sharada Vilas College, Mysore' },
  { name: 'M. V. Yathiraj Sharma',  year: 2023, role: 'Assistant Professor, Sharada Vilas College, Mysore' },
  { name: 'K. N. Harshitha',        year: 2023, role: '' },
  { name: 'A. I. Vijaya Shankar',   year: 2025, role: 'Assistant Professor, GFGCW, Kolar' },
  { name: 'P. Nagendra',            year: 2025, role: 'Assistant Professor, GFGC, Paduvalahippe' },
  { name: 'P. Divyananda',          year: 2025, role: 'Lecturer, Learner’s PU College, Mysore' },
  { name: 'Shibu Andia',            year: 2025, role: 'Assistant Professor, Vidyavardhaka College of Engineering, Mysore' },
  { name: 'Darshan A',              year: 2026, role: 'Assistant Professor, Government Science College, Hassan' },
  { name: 'Praveenkumar',           year: 2026, role: 'Assistant Professor, GCW (A), Mandya' }
];

/* Current research scholars — no award year yet. */
var RESEARCH_SCHOLARS = [
  { name: 'Ravi G. N.',      role: 'Assistant Professor, GFGCW, Kolar' },
  { name: 'Darshan D.',      role: 'UGC NFSC-JRF' },
  { name: 'Vijay C.',        role: 'CSIR-JRF' },
  { name: 'Roja R.',         role: 'Mysore University – Institute Fellowship' },
  { name: 'Ravikumar T. A.', role: 'Assistant Professor, Sheshadripuram Institute of Technology, Mysore' },
  { name: 'Puneeth R.',      role: 'UGC-JRF' }
];

/* Gallery — drop a JPEG into assets/gallery/ using the filename below and it
   replaces the placeholder tile automatically, the same way collaborator
   photos work. Missing files stay as a generated placeholder tile. */
var GALLERY = [
  { file: 'dos-mathematics-1.jpg', caption: 'Department of Studies in Mathematics, University of Mysore' },
  { file: 'uom-campus-1.jpg',      caption: 'University of Mysore · Manasagangotri main gate' },
  { file: 'uom-campus-2.jpg',      caption: 'Crawford Hall, University of Mysore' },
  { file: 'adiga-62nd-birthday-conference-2019.jpg', caption: 'Commemorating the 62nd birthday of Prof. C. Adiga — International Conference on Number Theory and Graph Theory, 27\u201329 June 2019, DOS in Mathematics, UOM' },
  { file: 'group-photo-conference-2019.jpg',         caption: 'Group photo — International Conference on Number Theory and Graph Theory, 27\u201329 June 2019, DOS in Mathematics, UOM' },
  { file: 'icsfa-2022.jpg',                           caption: 'ICSFA 2022' },
  { file: 'bruce-c-berndt-visiting-dos.jpg',          caption: 'Bruce C. Berndt visiting DOS Mathematics, UOM' },
  { file: 'with-bruce-c-berndt.jpg',                  caption: 'With Bruce C. Berndt' },
  { file: 'with-david-m-bressoud-1.jpg',              caption: 'With David M. Bressoud' },
  { file: 'with-david-m-bressoud-2.jpg',              caption: 'With David M. Bressoud' },
  { file: 'with-z-g-liu.jpg',                         caption: 'With Z. G. Liu' },
  { file: 'with-atul-dixit-bibekananda-maji.jpg',     caption: 'With Atul Dixit and Bibekananda Maji' },
  { file: 'ramanujan-birthplace-kumbakonam.jpg',      caption: 'Birthplace and childhood home of Srinivasa Ramanujan, Sarangapani Sannidhi Street, Kumbakonam, Tamil Nadu' }
];

/* t = title · a = authors · v = venue · y = year · c = citations */
var PUBS = [
  { t: "On Oliver's relations between infinite series and infinite products", a: "KR Vasuki", v: "arXiv preprint arXiv:2607.26471", y: 2026, c: 0, id: "9Ucx9csAAAAJ:bFI3QPDXJZMC", doi: "https://doi.org/10.48550/arxiv.2607.26471" },
  { t: "On certain new theta function identities of level-13 involving Ramanujan's functions", a: "KR Vasuki, N Prabhu, S Andia", v: "Note di Matematica, 101–112", y: 2026, c: 0, id: "9Ucx9csAAAAJ:f2IySw72cVMC", doi: "https://doi.org/10.1285/i15900932v46n1p101-112" },
  { t: "Evaluation of integrals of fine type of level 30", a: "KR Vasuki, Praveenkumar, C Vijay", v: "International Journal of Number Theory 22(06), 1231–1249", y: 2026, c: 0, id: "9Ucx9csAAAAJ:D03iK_w7-QYC", doi: "https://doi.org/10.1142/s1793042126500661" },
  { t: "New Ramanujan's type level 37 theta function identities", a: "KR Vasuki, A Darshan, P Nagendra", v: "The Ramanujan Journal 68(4), 105", y: 2025, c: 0, id: "9Ucx9csAAAAJ:fPk4N6BV_jEC" },
  { t: "On certain new modular equations in the alternative bases analogous to those in the classical base", a: "KR Vasuki, S Andia", v: "Acta Universitatis Sapientiae, Mathematica 17(1), 10", y: 2025, c: 0, id: "9Ucx9csAAAAJ:3s1wT3WcHBgC", doi: "https://doi.org/10.1007/s44426-025-00010-2" },
  { t: "On certain new Ramanujan type theta function identities", a: "KR Vasuki, P Nagendra", v: "Journal of Mathematical Analysis and Applications 546(2), 129329", y: 2025, c: 1, id: "9Ucx9csAAAAJ:pqnbT2bcN3wC" },
  { t: "On certain quaternary quadratic forms", a: "KR Vasuki, P Nagendra", v: "Integers: Electronic Journal of Combinatorial Number Theory 25, 1", y: 2025, c: 0, id: "9Ucx9csAAAAJ:a0OBvERweLwC", doi: "https://doi.org/10.7546/nntdm.2024.30.2.418-426" },
  { t: "On Entry 8 of Chapter 19 of Ramanujan's Second Notebook", a: "KR Vasuki, A Darshan", v: "", y: 2025, c: 0, id: "9Ucx9csAAAAJ:SeFeTyx0c_EC", doi: "https://doi.org/10.7546/nntdm.2025.31.1.157-165" },
  { t: "Level-13 theta function identities of Ramanujan and applications", a: "KR Vasuki, N Prabhu", v: "Acta Arithmetica 219, 81–99", y: 2025, c: 5, id: "9Ucx9csAAAAJ:HoB7MX3m0LUC" },
  { t: "On derivative of eta quotients of levels 12 and 16", a: "KR Vasuki, P Nagendra, P Divyananda", v: "International J. Math. Combin. 3, 19–32", y: 2024, c: 1, id: "9Ucx9csAAAAJ:g5m5HwL7SMYC" },
  { t: "New and simple proofs of Ramanujan's modular equations of degree 11", a: "KR Vasuki, MV Yathirajsharma", v: "International Journal of Number Theory 20(01), 283–297", y: 2024, c: 2, id: "9Ucx9csAAAAJ:70eg2SAEIzsC", doi: "https://doi.org/10.1142/s1793042124500143" },
  { t: "On level 3 Ramanujan–Sato type series for 1/π", a: "KR Vasuki, T Anusha, HT Shwetha", v: "Journal of the Indian Mathematical Society 91(1/2), 1", y: 2024, c: 0, id: "9Ucx9csAAAAJ:M05iB0D1s5AC" },
  { t: "On certain relations among the generating functions for certain quadratic forms", a: "KR Vasuki, P Nagendra", v: "", y: 2024, c: 0, id: "9Ucx9csAAAAJ:ldfaerwXgEUC" },
  { t: "On two theta function identities of Ramanujan", a: "KR Vasuki, AIV Shankar", v: "Indian Journal of Pure and Applied Mathematics 54(4), 1099–1104", y: 2023, c: 0, id: "9Ucx9csAAAAJ:R3hNpaxXUhUC", doi: "https://doi.org/10.1007/s13226-022-00323-9" },
  { t: "Crossed out modular equations of degree 11 of Ramanujan", a: "KR Vasuki, MV Yathirajsharma", v: "The Ramanujan Journal 61(4), 1145–1150", y: 2023, c: 1, id: "9Ucx9csAAAAJ:_Qo2XoVZTnwC", doi: "https://doi.org/10.1007/s11139-022-00630-z" },
  { t: "On a modular equation of degree 23", a: "KR Vasuki, S Andia", v: "South East Asian Journal of Mathematics and Mathematical Sciences 19(3), 63–74", y: 2023, c: 0, id: "9Ucx9csAAAAJ:cFHS6HbyZ2cC" },
  { t: "Evaluation of convolution sums", a: "K Pushpa, KR Vasuki", v: "Indian Journal of Pure and Applied Mathematics 53(4), 1110–1121", y: 2022, c: 0, id: "9Ucx9csAAAAJ:QIV2ME_5wuYC", doi: "https://doi.org/10.1007/s13226-022-00222-z" },
  { t: "On incomplete elliptic integrals related to Ramanujan's theta functions", a: "KR Vasuki, G Vinay", v: "The Journal of Analysis 30(4), 1485–1495", y: 2022, c: 1, id: "9Ucx9csAAAAJ:hqOjcs7Dif8C" },
  { t: "On Eisenstein series, color partition and divisor function", a: "K Pushpa, KR Vasuki", v: "Arabian Journal of Mathematics 11(2), 355–378", y: 2022, c: 4, id: "9Ucx9csAAAAJ:O3NaXMp0MMsC", doi: "https://doi.org/10.1007/s40065-022-00360-6" },
  { t: "Evaluation of convolution sums for k = a ± b = 21, 33, and 35", a: "K Pushpa, KR Vasuki", v: "Glasgow Mathematical Journal 64(2), 434–453", y: 2022, c: 0, id: "9Ucx9csAAAAJ:ns9cj8rnVeAC" },
  { t: "Trigonometric sums through Ramanujan's theory of theta functions", a: "KN Harshitha, KR Vasuki, MV Yathirajsharma", v: "The Ramanujan Journal 57(3), 931–948", y: 2022, c: 14, id: "9Ucx9csAAAAJ:mVmsd5A6BfQC", doi: "https://doi.org/10.1007/s11139-020-00349-9" },
  { t: "On Ramanujan's Eisenstein series of level 5 and 7", a: "K Pushpa, KR Vasuki", v: "Journal of the Ramanujan Mathematical Society 37(3), 257–272", y: 2022, c: 0, id: "9Ucx9csAAAAJ:qxL8FJ1GzNcC" },
  { t: "On modular equations of degree 25", a: "KR Vasuki, MV Yathirajsharma", v: "The Ramanujan Journal 56(2), 743–752", y: 2021, c: 1, id: "9Ucx9csAAAAJ:Tyk-4Ss8FVUC" },
  { t: "Classical approach to Ramanujan's modular equations of septic degree", a: "KR Vasuki, Mahadevaswamy", v: "The Ramanujan Journal 51(3), 553–561", y: 2020, c: 0, id: "9Ucx9csAAAAJ:UeHWp8X0CEIC", doi: "https://doi.org/10.1007/s13226-019-0376-x" },
  { t: "Revisit to Ramanujan's modular equations of degree 21", a: "KR Vasuki, EN Bhuvan, T Anusha", v: "Indian Journal of Pure and Applied Mathematics 50(4), 1097–1105", y: 2019, c: 1, id: "9Ucx9csAAAAJ:4JMBOYKVnBMC" },
  { t: "On a Ramanujan's Eisenstein series identity of level fifteen", a: "EN Bhuvan, KR Vasuki", v: "Proceedings – Mathematical Sciences 129(4), 57", y: 2019, c: 3, id: "9Ucx9csAAAAJ:IjCSPb-OGe4C", doi: "https://doi.org/10.1007/s12044-019-0498-4" },
  { t: "Elliptic integrals and Ramanujan-type series for 1/π associated with Γ₀(N), where N is a product of two small primes", a: "T Anusha, EN Bhuvan, S Cooper, KR Vasuki", v: "Journal of Mathematical Analysis and Applications 472(2), 1551–1570", y: 2019, c: 7, id: "9Ucx9csAAAAJ:JV2RwH3_ST0C", doi: "https://doi.org/10.1016/j.jmaa.2018.12.008" },
  { t: "“cases? for φ also” — a question raised by Ramanujan", a: "KR Vasuki, EN Bhuvan", v: "International Journal of Number Theory 15(1), 183", y: 2019, c: 2, id: "9Ucx9csAAAAJ:NMxIlDl6LWMC", doi: "https://doi.org/10.1142/s1793042119500076" },
  { t: "On a pair of Ramanujan's modular equations and θ-theta functions of level 35", a: "KR Vasuki", v: "Turkish Journal of Mathematics 43(1), 63–80", y: 2019, c: 0, id: "9Ucx9csAAAAJ:TQgYirikUcIC", doi: "https://doi.org/10.3906/mat-1805-51" },
  { t: "Ramanujan's Eisenstein series of level 3 and 6, its application", a: "KR Vasuki, RG Veeresha, EN Bhuvan", v: "South East Asian Journal of Mathematics & Mathematical Sciences 14(1), 01", y: 2018, c: 3, id: "9Ucx9csAAAAJ:lSLTfruPkqcC", doi: "https://doi.org/10.1016/j.jnt.2015.07.019" },
  { t: "On Somos's theta-function identities of level 14", a: "KR Vasuki, RG Veeresha", v: "The Ramanujan Journal 42(1), 131–144", y: 2017, c: 26, id: "9Ucx9csAAAAJ:maZDTaKrznsC", doi: "https://doi.org/10.1007/s11139-015-9714-8" },
  { t: "Ramanujan's Eisenstein series of level 7 and 14", a: "KR Vasuki, RG Veeresha", v: "Journal of Number Theory 159, 59–75", y: 2016, c: 19, id: "9Ucx9csAAAAJ:_FxGoFyzp5QC" },
  { t: "On certain Ramanujan's modular equations of degree 7", a: "KR Vasuki", v: "Advanced Studies in Contemporary Mathematics 26(1), 45–61", y: 2016, c: 1, id: "9Ucx9csAAAAJ:ZHo1McVdvXMC", doi: "https://doi.org/10.1016/j.jnt.2015.01.002" },
  { t: "On Ramanujan's modular equation of degree 7", a: "KR Vasuki, RG Veeresha", v: "Journal of Number Theory 153, 304–308", y: 2015, c: 7, id: "9Ucx9csAAAAJ:YsMSGLbcyi4C", doi: "https://doi.org/10.1134/s0001434614050058" },
  { t: "On some Ramanujan identities for the ratios of eta-functions", a: "S Bhargava, KR Vasuki, KR Rajanna", v: "Ukrainian Mathematical Journal 66(8), 1131–1151", y: 2015, c: 9, id: "9Ucx9csAAAAJ:mB3voiENLucC", doi: "https://doi.org/10.1007/s11253-015-0999-y" },
  { t: "On some Ramanujan identities for the ratios of eta-functions", a: "S Bhargava, KR Rajanna, KR Vasuki", v: "Ukrains'kyi Matematychnyi Zhurnal 66(8), 1011–1028", y: 2014, c: 3, id: "9Ucx9csAAAAJ:qjMakFHDy7sC" },
  { t: "On certain identities for ratios of theta-functions and some new modular equations of mixed degree", a: "KR Vasuki, C Chamaraju", v: "Mathematical Notes 95(5), 615–624", y: 2014, c: 3, id: "9Ucx9csAAAAJ:YFjsv_pBGBYC" },
  { t: "Further two dimensional series evaluations via the elliptic functions of Ramanujan and Jacobi", a: "KR Vasuki, RG Veeresha, KAA Alloush", v: "Acta Universitatis Apulensis, 225–247", y: 2014, c: 0, id: "9Ucx9csAAAAJ:HDshCWvjkbEC", doi: "https://doi.org/10.17114/j.aua.2014.39.19" },
  { t: "On Ramanujan's modular equations of degree 21", a: "KR Vasuki, G Sharath", v: "Journal of Number Theory 133(2), 437–445", y: 2013, c: 2, id: "9Ucx9csAAAAJ:-f6ydRqryjwC" },
  { t: "On Ramanujan's modular equations of degree 35", a: "KR Vasuki, G Sharath", v: "Journal of Mathematical Analysis and Applications 396(1), 13–20", y: 2012, c: 3, id: "9Ucx9csAAAAJ:BqipwSGYUEgC" },
  { t: "Some new modular relations for the cubic functions", a: "C Adiga, KR Vasuki, N Bhaskar", v: "Southeast Asian Bulletin of Mathematics 36(6), 769", y: 2012, c: 15, id: "9Ucx9csAAAAJ:MXK_kJrjxJIC" },
  { t: "On the series expansion of the Ramanujan cubic continued fraction", a: "KR Vasuki, AAA Kahtan, G Sharath", v: "Mathematical Combinatorics 4, 84–95", y: 2011, c: 1, id: "9Ucx9csAAAAJ:Zph67rFs4hoC" },
  { t: "On certain theta function identities analogous to Ramanujan's P–Q eta function identities", a: "KR Vasuki, AAA Kahtan", v: "Applied Mathematics 2(7), 874", y: 2011, c: 8, id: "9Ucx9csAAAAJ:W7OEmFMy1HYC", doi: "https://doi.org/10.4236/am.2011.27117" },
  { t: "On a continued fraction of order 12", a: "KR Vasuki, AAA Kahtan, G Sharath, CS Kumar", v: "Ukrainian Mathematical Journal 62(12), 1866–1878", y: 2011, c: 12, id: "9Ucx9csAAAAJ:hFOr9nPyWt4C", doi: "https://doi.org/10.1007/s11253-011-0476-1" },
  { t: "On some identities of Ramanujan–Göllnitz–Gordon continued fraction", a: "KR Vasuki, G Sharath, KR Rajanna", v: "Notes on Number Theory and Discrete Mathematics 17(4), 37–41", y: 2011, c: 0, id: "9Ucx9csAAAAJ:2osOgNQ5qMEC" },
  { t: "On a continued fraction of order twelve", a: "AAA Kahtan, KC Sathish, G Sharath, KR Vasuki", v: "Ukrains'kyi Matematychnyi Zhurnal 62(12), 1609–1619", y: 2010, c: 0, id: "9Ucx9csAAAAJ:Y0pCki6q_DkC" },
  { t: "On certain new modular relations for the Rogers–Ramanujan type functions of order twelve", a: "KR Vasuki, PS Guruprasad", v: "Advanced Studies in Contemporary Mathematics 20(3), 319–333", y: 2010, c: 10, id: "9Ucx9csAAAAJ:M3NEmzRMIkIC" },
  { t: "On certain continued fractions related to ₃ψ₃ basic bilateral hypergeometric functions", a: "KR Vasuki, G Sharath, AAA Kahtan", v: "Advanced Studies in Contemporary Mathematics 20(3), 343–357", y: 2010, c: 1, id: "9Ucx9csAAAAJ:u5HHmVD_uO8C" },
  { t: "On a continued fraction of order six", a: "KR Vasuki, N Bhaskar, G Sharath", v: "Università di Ferrara, Annali, Sezione 7: Scienze Matematiche 56(1), 77–89", y: 2010, c: 12, id: "9Ucx9csAAAAJ:RGFaLdJalmkC" },
  { t: "General formulas for evaluation of singular modulus of the complete elliptic integral", a: "KR Vasuki, G Sharath, N Bhaskar", v: "Advanced Studies in Contemporary Mathematics, 29–56", y: 2010, c: 0, id: "9Ucx9csAAAAJ:hC7cP41nSMkC" },
  { t: "On a ₂ψ₂ basic bilateral hypergeometric series summation formula", a: "KR Vasuki, KR Rajanna", v: "International Mathematical Forum 5(15), 745–753", y: 2010, c: 1, id: "9Ucx9csAAAAJ:L8Ckcad2t8MC" },
  { t: "Two modular equations for squares of the cubic-functions with applications", a: "KR Vasuki, G Sharath, KR Rajanna", v: "Note di Matematica, 61–72", y: 2010, c: 16, id: "9Ucx9csAAAAJ:Wp0gIr-vW9MC", doi: "https://doi.org/10.1285/i15900932v30n2p61" },
  { t: "On the ₃ψ₃ basic bilateral hypergeometric series summation formulas", a: "KR Vasuki, G Sharath", v: "Mathematical Combinatorics 4", y: 2009, c: 0, id: "9Ucx9csAAAAJ:dfsIfKJdRG4C" },
  { t: "On certain Ramanujan–Weber type modular equations", a: "KR Vasuki", v: "Journal of the Indian Mathematical Society 75(1), 173", y: 2008, c: 2, id: "9Ucx9csAAAAJ:9ZlFYXVOiuMC" },
  { t: "On modular relations for the functions analogous to Rogers–Ramanujan functions with applications to partitions", a: "C Adiga, KR Vasuki, BR Srivatsa Kumar", v: "South East J. Math. Math. Soc. 6, 131–144", y: 2008, c: 11, id: "9Ucx9csAAAAJ:zYLM7Y9cAGgC" },
  { t: "On certain continued fraction expansions for ratios of basic hypergeometric series", a: "KR Vasuki, KR Rajanna", v: "Proceedings of the Jangjeon Mathematical Society 10(2)", y: 2007, c: 0, id: "9Ucx9csAAAAJ:4TOpqqG69KYC" },
  { t: "Certain identities for Ramanujan–Göllnitz–Gordon continued fraction", a: "KR Vasuki, BRS Kumar", v: "Journal of Computational and Applied Mathematics 187(1), 87–95", y: 2006, c: 29, id: "9Ucx9csAAAAJ:r0BpntZqJG4C" },
  { t: "On some Ramanujan's Schläfli-type modular equations", a: "KR Vasuki", v: "J. Aust. Math. Anal. Appl. 3(2), 1–8", y: 2006, c: 5, id: "9Ucx9csAAAAJ:pyW8ca7W8N0C", doi: "https://doi.org/10.1016/j.jmaa.2005.01.035" },
  { t: "A new identity for the Rogers–Ramanujan continued fraction", a: "KR Vasuki, SR Swamy", v: "J. Appl. Math. Anal. Appl. 2(1), 71–83", y: 2006, c: 6, id: "9Ucx9csAAAAJ:NaGl4SEjCO4C" },
  { t: "Evaluations of the Ramanujan–Göllnitz–Gordon continued fraction H(q) by modular equations", a: "KR Vasuki, BRS Kumar", v: "Indian J. Math. 48(3), 275–300", y: 2006, c: 11, id: "9Ucx9csAAAAJ:bEWYMUwI8FkC" },
  { t: "On some of Ramanujan's P–Q modular equations", a: "KR Vasuki", v: "J. Indian Math. Soc. 73(3–4), 131–143", y: 2006, c: 18, id: "9Ucx9csAAAAJ:iH-uZ7U-co4C" },
  { t: "Two identities for Ramanujan's cubic continued fraction", a: "KR Vasuki, BRS Kumar", v: "Preprint 19, 71–83", y: 2006, c: 7, id: "9Ucx9csAAAAJ:7PzlFSSx8tAC" },
  { t: "A note on Ramanujan–Schläfli type mixed modular equations", a: "KR Vasuki, BRS Kumar", v: "South East Asian Journal of Mathematics and Mathematical Sciences 5(1), 51–67", y: 2006, c: 5, id: "9Ucx9csAAAAJ:WF5omc3nYNoC" },
  { t: "A note on P–Q modular equations", a: "KR Vasuki, TG Sreeramamurthy", v: "Tamsui Oxford Journal of Mathematical Sciences 21(2), 109–121", y: 2005, c: 26, id: "9Ucx9csAAAAJ:3fE2CSJIrl8C" },
  { t: "Certain new Ramanujan's Schläfli-type mixed modular equations", a: "KR Vasuki, TG Sreeramamurthy", v: "Journal of Mathematical Analysis and Applications 309(1), 238–255", y: 2005, c: 11, id: "9Ucx9csAAAAJ:UebtZRa9Y70C" },
  { t: "Evaluations of Ramanujan–Weber class invariant gₙ", a: "S Bhargava, M Gangotri, KR Vasuki, BRS Kumar, CP Soldevanahalli", v: "J. Indian Math. Soc. 72(1–4), 115–127", y: 2005, c: 4, id: "9Ucx9csAAAAJ:_kc_bZDykSQC" },
  { t: "A note on explicit evaluations of Ramanujan's continued fraction", a: "KR Vasuki, TG Sreeramamurthy", v: "Advanced Studies in Contemporary Mathematics (Kyungshang) 9, 63–80", y: 2004, c: 6, id: "9Ucx9csAAAAJ:ufrVoPGSRksC" },
  { t: "Some evaluations of Ramanujan's cubic continued fraction", a: "S Bhargava, KR Vasuki, TG Sreeramamurthy", v: "Indian Journal of Pure & Applied Mathematics 35(8), 1003–1025", y: 2004, c: 23, id: "9Ucx9csAAAAJ:u-x6o8ySG0sC" },
  { t: "Some new values for the Rogers–Ramanujan continued fraction", a: "KR Vasuki, K Shivashankara", v: "Journal of the Indian Mathematical Society 70(1–4), 87–95", y: 2003, c: 3, id: "9Ucx9csAAAAJ:M3ejUd6NZC8C" },
  { t: "On certain continued fractions related to ₂ψ₂ basic bilateral hypergeometric functions", a: "KR Vasuki, HS Madhusudhan", v: "Indian Journal of Pure & Applied Mathematics 33(10), 1563–1573", y: 2002, c: 6, id: "9Ucx9csAAAAJ:4DMP91E08xMC" },
  { t: "On Ramanujan's continued fractions", a: "KR Vasuki, K Shivashankara", v: "Ganita 53(1), 81–88", y: 2002, c: 8, id: "9Ucx9csAAAAJ:GnPB-g6toBAC" },
  { t: "Some theta function identities and new explicit evaluation of Rogers–Ramanujan continued fraction", a: "C Adiga, KR Vasuki, K Shivashankara", v: "Tamsui Oxford Journal of Mathematical Sciences 18(1), 101–117", y: 2002, c: 8, id: "9Ucx9csAAAAJ:blknAaTinKkC", doi: "https://doi.org/10.46298/hrj.2001.143" },
  { t: "Some new explicit evaluations of Ramanujan's cubic continued fraction", a: "C Adiga, KR Vasuki, MSM Naika", v: "New Zealand J. Math. 31(2), 109–114", y: 2002, c: 36, id: "9Ucx9csAAAAJ:k_IJM867U9cC" },
  { t: "On sums of triangular numbers", a: "C Adiga, KR Vasuki", v: "Mathematics Student – India 70(1–4), 185–190", y: 2001, c: 7, id: "9Ucx9csAAAAJ:hMod-77fHWUC" },
  { t: "On some Ramanujan's P–Q identities", a: "HS Madhusudhan, MSM Naika, KR Vasuki", v: "Hardy–Ramanujan Journal 24", y: 2001, c: 2, id: "9Ucx9csAAAAJ:ZeXyd9-uunAC" },
  { t: "On some new continued fractions related to ₂φ₁ basic hypergeometric functions", a: "KR Vasuki, K Shivashankara", v: "Far East Journal of Mathematical Sciences 3(3), 435–444", y: 2001, c: 1, id: "9Ucx9csAAAAJ:dhFuZR0502QC" },
  { t: "On some new identities involving integrals of theta-functions", a: "C Adiga, KR Vasuki, MSM Naika", v: "Advanced Studies in Contemporary Mathematics 3, 1–11", y: 2001, c: 13, id: "9Ucx9csAAAAJ:5nxA0vEk-isC" },
  { t: "Some new explicit evaluations of ratios of theta-functions", a: "KR Vasuki, MSM Naika", v: "Proc. Nat. Conf. of Challenges of the 21st Century in Mathematics and its Allied Topics", y: 2001, c: 2, id: "9Ucx9csAAAAJ:9yKSN-GCB0IC" },
  { t: "Some evaluations of the Rogers–Ramanujan continued fractions", a: "KR Vasuki, MSM Naika", v: "Proc. Inter. Conf. on the works of Srinivasa Ramanujan, Mysore", y: 2000, c: 13, id: "9Ucx9csAAAAJ:KlAtU1dfN6UC" },
  { t: "Some explicit evaluations of theta-functions", a: "C Adiga, KR Vasuki", v: "Far East Journal of Mathematical Sciences 2(4), 625–632", y: 2000, c: 3, id: "9Ucx9csAAAAJ:aqlVkmm33-oC" },
  { t: "A note on explicit evaluations of products and ratios of class invariants", a: "KR Vasuki, K Shivashankara", v: "Math. Forum 13, 45–46", y: 2000, c: 10, id: "9Ucx9csAAAAJ:YOwf2qJgpHMC" },
  { t: "Products and ratios of class invariants", a: "KR Vasuki, K Shivashankara", v: "Mathematical Forum 13", y: 1999, c: 0, id: "9Ucx9csAAAAJ:yD5IFk8b50cC" },
  { t: "W. N. Bailey's basic bilateral hypergeometric series summation formula and its applications", a: "KR Vasuki", v: "Mathematics Student – India 68(1–4), 211–218", y: 1999, c: 5, id: "9Ucx9csAAAAJ:RHpTSmoSYBkC" },
  { t: "On some continued fractions related to ₂ψ₂ basic bilateral hypergeometric series", a: "KR Vasuki", v: "Math. Forum 12, 31–43", y: 1998, c: 5, id: "9Ucx9csAAAAJ:2P1L_qKh6hAC" },
  { t: "A note on rational approximations", a: "C Adiga, KR Vasuki", v: "The Journal of the Indian Mathematical Society 65(1–4), 181–189", y: 1998, c: 0, id: "9Ucx9csAAAAJ:J_g5lzvAfSwC" }
];
