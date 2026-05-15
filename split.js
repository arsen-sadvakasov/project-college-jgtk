const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const getBlock = (startMarker, endMarker) => {
    const startIndex = html.indexOf(startMarker);
    if (startIndex === -1) throw new Error('Missing ' + startMarker);
    const endIndex = endMarker ? html.indexOf(endMarker) : html.length;
    if (endIndex === -1) throw new Error('Missing ' + endMarker);
    return html.substring(startIndex, endIndex);
};

const headAndNav = getBlock('<!DOCTYPE html>', '<!-- ===== HERO SECTION ===== -->');
const hero = getBlock('<!-- ===== HERO SECTION ===== -->', '<!-- ===== PROFESSIONS SECTION ===== -->');
const professions = getBlock('<!-- ===== PROFESSIONS SECTION ===== -->', '<!-- ===== MODALS ===== -->');
const modals = getBlock('<!-- ===== MODALS ===== -->', '<!-- ===== CALCULATOR SECTION ===== -->');
const calculator = getBlock('<!-- ===== CALCULATOR SECTION ===== -->', '<!-- ===== MISSION SECTION ===== -->');
const mission = getBlock('<!-- ===== MISSION SECTION ===== -->', '<!-- ===== GALLERY SECTION ===== -->');
const gallery = getBlock('<!-- ===== GALLERY SECTION ===== -->', '<!-- ===== DOCUMENTS SECTION ===== -->');
const documents = getBlock('<!-- ===== DOCUMENTS SECTION ===== -->', '<!-- ===== TIMELINE ===== -->');
const timeline = getBlock('<!-- ===== TIMELINE ===== -->', '<!-- ===== CONTACT SECTION ===== -->');
const contact = getBlock('<!-- ===== CONTACT SECTION ===== -->', '<!-- ===== FAQ ===== -->');
const faq = getBlock('<!-- ===== FAQ ===== -->', '<!-- ===== RATING SECTION ===== -->');
const rating = getBlock('<!-- ===== RATING SECTION ===== -->', '<!-- ===== FOOTER ===== -->');
const footer = getBlock('<!-- ===== FOOTER ===== -->', null);

// Page 1: index.html
fs.writeFileSync('index.html', headAndNav + hero + rating + footer);

// Page 2: about.html
fs.writeFileSync('about.html', headAndNav + mission + gallery + footer);

// Page 3: specialties.html
fs.writeFileSync('specialties.html', headAndNav + professions + modals + footer);

// Page 4: admissions.html
fs.writeFileSync('admissions.html', headAndNav + calculator + documents + timeline + faq + footer);

// Page 5: contact.html
fs.writeFileSync('contact.html', headAndNav + contact + footer);

console.log("Files successfully split.");
