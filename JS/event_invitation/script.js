const $ = (id) => document.getElementById(id);

const form = $("eventForm");
const card = $("formCard");
const modal = $("modal");
const modalClose = $("modalClose");

const values = () => {
  return {
    name: $("name").value.trim(),
    date: $("date").value,
    start: $("start").value,
    end: $("end").value,
    desc: $("desc").value.trim(),
    loc: $("loc").value.trim(),
  };
};

const showMsg = (text) => {
  modal.hidden = false;
  $("modalText").textContent = text;
};

modalClose.onclick = () => {
  modal.hidden = true;
};

form.onsubmit = (e) => {
  e.preventDefault();

  const d = values();

  if (!d.name || !d.date || !d.start || !d.end || !d.desc || !d.loc) {
    showMsg("Please fill in all fields");
    return;
  }

  modal.hidden = true;
  card.style.display = "none";
  // document.body.style.backgroundColor = white;
  document.body.style.background = "#fff";

  const s = document.createElement("section");
  s.className = "invite";

  s.innerHTML = `
    <h1 style="color: #e74c3c; margin: 0 0 10px 0;">YOU ARE INVITED</h1>
    <h3 style="font-style: italic; font-weight: normal; margin: 0 0 5px 0; text-align: center;">TO JOIN THE</h3>
    <h2 style="margin: 0 0 15px 0; text-align: center;">${d.name}</h2>
    <p style="color: #e74c3c; text-align: left; margin: 8px 0;">${new Date(d.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    <p style="color: #000; text-align: left; margin: 8px 0;">${d.start} - ${d.end}</p>
    <p style="color: #000; text-align: left; margin: 8px 0;">${d.loc}</p>
    <p style="color: #000; text-align: left; margin: 8px 0;">${d.desc}</p>
  `;

  card.parentElement.appendChild(s);
};
