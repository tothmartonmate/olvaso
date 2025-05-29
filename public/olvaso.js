const olvasoArray = [];
const olvasoTable = document.getElementById('olvasoTable');

document.getElementById('olvasoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const olvasoData = Object.fromEntries(formData);

    // Szám konvertálás
    olvasoData.olvaso_id = parseInt(olvasoData.olvaso_id);
    olvasoData.kolcsonzes_szam = parseInt(olvasoData.kolcsonzes_szam);

    try {
        const res = await fetch('/olvaso', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(olvasoData)
        });

        const msg = await res.text();
        alert(msg);

        if (res.ok) {
            olvasoArray.push(olvasoData);
            renderTable();
            e.target.reset();
        }
    } catch (err) {
        console.error('Hiba történt:', err);
        alert('Hiba történt a mentés során.');
    }
});

function renderTable() {
    olvasoTable.innerHTML = olvasoArray.map((olvaso, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${olvaso.olvaso_id}</td>
            <td>${olvaso.nev}</td>
            <td>${olvaso.regisztracio_datuma}</td>
            <td>${olvaso.lakcim}</td>
            <td>${olvaso.tagsagszam}</td>
            <td>${olvaso.kolcsonzes_szam}</td>
        </tr>
    `).join('');
}

// Oldal betöltésekor lekérdezzük az eddigi adatokat:
window.onload = async () => {
    try {
        const res = await fetch('/olvaso');
        const data = await res.json();
        olvasoArray.push(...data);
        renderTable();
    } catch (err) {
        console.error('Adatok lekérése sikertelen:', err);
    }
};
