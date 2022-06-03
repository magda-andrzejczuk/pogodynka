let elementWyszukiwarka = document.querySelector("#wyszukiwarka");
let elementWybierajka = document.querySelector("#wybierajka");
let elementLadowanie = document.querySelector("#loading");

let elementDzisIkonka = document.querySelector(".pogodaAktualna .ikonka");
let elementDzisTemp = document.querySelector(".pogodaAktualna .temp");
let elementDzisZachmurzenie = document.querySelector(".pogodaAktualna .zachmurzenie");
let elementDzisKierunekWiatru = document.querySelector(".pogodaAktualna .kierunekWiatru");
let elementDzisOpis = document.querySelector(".pogodaAktualna .opis");

let elementJutroIkonka = document.querySelector(".pogodaJutro .ikonka");
let elementJutroTemp = document.querySelector(".pogodaJutro .temp");
let elementJutroZachmurzenie = document.querySelector(".pogodaJutro .zachmurzenie");
let elementJutroKierunekWiatru = document.querySelector(".pogodaJutro .kierunekWiatru");
let elementJutroOpis = document.querySelector(".pogodaJutro .opis");

function wlaczLadowanie() {
  elementLadowanie.style.display = "flex";
}

function wylaczLadowanie() {
  elementLadowanie.style.display = "none";
}

function pobierzDane(miasto) {
  wlaczLadowanie();
  fetch(`https://www.wowapi.pl/pogoda/prognoza?miasto=${miasto}`).then(
    odbierzDane
  );
}

function odbierzDane(response) {
  response.json().then(rozpakujDane);
}

function rozpakujDane(dane) {
  if (!dane.prognoza) {
    return;
  }

  const dzis = dane.prognoza.dziś;
  elementDzisTemp.innerHTML = dzis.temperatura;
  elementDzisZachmurzenie.innerHTML = dzis.zachmurzenie;
  elementDzisKierunekWiatru.innerHTML = dzis.wiatrKierunekSłownie;
  elementDzisOpis.innerHTML = dzis.opis;

  elementDzisIkonka.innerHTML = "";
  const ikonkaDzis = document.createElement("img");
  ikonkaDzis.src = `./ikonki/${dzis.ikonka}.png`;
  elementDzisIkonka.appendChild(ikonkaDzis);

  const jutro = dane.prognoza.jutro;
  elementJutroTemp.innerHTML = jutro.temperatura;
  elementJutroZachmurzenie.innerHTML = jutro.zachmurzenie;
  elementJutroKierunekWiatru.innerHTML = jutro.wiatrKierunekSłownie;
  elementJutroOpis.innerHTML = jutro.opis;

  elementJutroIkonka.innerHTML = "";
  const ikonkaJutro = document.createElement("img");
  ikonkaJutro.src = `./ikonki/${jutro.ikonka}.png`;
  elementJutroIkonka.appendChild(ikonkaJutro);

  wylaczLadowanie();
}

function pobierzDaneMiasta(miasto = null) {
  let url = `https://www.wowapi.pl/pogoda/miasta`;
  if (miasto) {
    url += `?szukaj=${miasto}`;
  }
  wlaczLadowanie();
  fetch(url).then(
    odbierzDaneMiasta
  );
}

function odbierzDaneMiasta(response) {
  response.json().then(rozpakujDaneMiasta);
}

function rozpakujDaneMiasta(dane) {
  elementWybierajka.innerHTML = "";
  for (let i = 0; i < dane.length; i++) {
    const miastoElement = document.createElement("option");
    miastoElement.innerHTML = dane[i].nazwa;
    elementWybierajka.appendChild(miastoElement);
  }
  if (dane.length) {
    pobierzDane(dane[0].nazwa);
  }
  wylaczLadowanie();
}

elementWybierajka.addEventListener("change", function () {
  pobierzDane(elementWybierajka.value);
});

elementWyszukiwarka.addEventListener("change", function () {
  if (elementWyszukiwarka.value) {
    pobierzDaneMiasta(elementWyszukiwarka.value);
  } else {
    pobierzDaneMiasta();
  }
});

pobierzDaneMiasta();
