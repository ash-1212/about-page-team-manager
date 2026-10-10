let members = [];

// ── Load from localStorage
function loadMembers() {
  const stored = localStorage.getItem('teamData');
  if (stored) {
    members = JSON.parse(stored);
  } else {
    // seed from JSON if admin opens first
    fetch('data/team.json')
      .then(r => r.json())
      .then(data => {
        members = data;
        localStorage.setItem('teamData', JSON.stringify(members));
        renderTable();
      });
    return;
  }
  renderTable();
}

// ── Render admin table
function renderTable() {
  const tbody = document.getElementById('adminTableBody');
  const count = document.getElementById('memberCount');
  if (!tbody) return;

  count.textContent = `${members.length} member${members.length !== 1 ? 's' : ''}`;
  tbody.innerHTML = '';

  if (members.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-4">No team members yet. Add one above!</td>
      </tr>`;
    return;
  }

  members.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${m.image}" alt="${m.name}"/></td>
      <td><strong>${m.name}</strong></td>
      <td><span class="role-badge">${m.role}</span></td>
      <td style="max-width:200px; font-size:0.82rem; color:#aaa;">${m.bio.substring(0, 60)}...</td>
      <td>
        <button class="btn-edit" onclick="editMember(${m.id})">
          <i class="bi bi-pencil"></i> Edit
        </button>
        <button class="btn-delete" onclick="deleteMember(${m.id})">
          <i class="bi bi-trash"></i> Delete
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Save (Add or Update)
function saveMember() {
  const name = document.getElementById('memberName').value.trim();
  const role = document.getElementById('memberRole').value;
  const image = document.getElementById('memberImage').value.trim();
  const bio = document.getElementById('memberBio').value.trim();
  const linkedin = document.getElementById('memberLinkedin').value.trim() || '#';
  const github = document.getElementById('memberGithub').value.trim() || '#';
  const editId = document.getElementById('editId').value;

  if (!name || !role || !bio) {
    showToast('Please fill in Name, Role, and Bio.', '#dc3545');
    return;
  }

  if (editId) {
    // Update existing
    const idx = members.findIndex(m => m.id === parseInt(editId));
    if (idx !== -1) {
      members[idx] = {
        ...members[idx], name, role,
        image: image || members[idx].image,
        bio, linkedin, github
      };
      showToast('Member updated successfully!', '#28a745');
    }
    cancelEdit();
  } else {
    // Add new
    const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
    members.push({
      id: newId,
      name, role,
      image: image || 'https://randomuser.me/api/portraits/lego/1.jpg',
      bio, linkedin, github
    });
    showToast('Member added successfully!', '#28a745');
    clearForm();
  }

  localStorage.setItem('teamData', JSON.stringify(members));
  renderTable();
}

// ── Edit
function editMember(id) {
  const m = members.find(x => x.id === id);
  if (!m) return;

  document.getElementById('editId').value = m.id;
  document.getElementById('memberName').value = m.name;
  document.getElementById('memberRole').value = m.role;
  document.getElementById('memberImage').value = m.image;
  document.getElementById('memberBio').value = m.bio;
  document.getElementById('memberLinkedin').value = m.linkedin;
  document.getElementById('memberGithub').value = m.github;

  document.getElementById('formTitle').innerHTML =
    `<i class="bi bi-pencil-square me-2"></i>Edit Member – ${m.name}`;
  document.getElementById('saveBtn').innerHTML =
    `<i class="bi bi-check-lg me-1"></i> Update Member`;
  document.getElementById('cancelBtn').classList.remove('d-none');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Delete
function deleteMember(id) {
  if (!confirm('Are you sure you want to delete this member?')) return;
  members = members.filter(m => m.id !== id);
  localStorage.setItem('teamData', JSON.stringify(members));
  renderTable();
  showToast('Member deleted.', '#dc3545');
}

// ── Cancel edit
function cancelEdit() {
  clearForm();
  document.getElementById('editId').value = '';
  document.getElementById('formTitle').innerHTML =
    `<i class="bi bi-person-plus me-2"></i>Add New Team Member`;
  document.getElementById('saveBtn').innerHTML =
    `<i class="bi bi-check-lg me-1"></i> Save Member`;
  document.getElementById('cancelBtn').classList.add('d-none');
}

function clearForm() {
  ['memberName','memberImage','memberBio','memberLinkedin','memberGithub']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('memberRole').value = '';
}

// ── Toast notification
function showToast(msg, bg = '#28a745') {
  const toastEl = document.getElementById('adminToast');
  document.getElementById('toastMsg').textContent = msg;
  toastEl.style.background = bg;
  new bootstrap.Toast(toastEl, { delay: 3000 }).show();
}

// ── Start
loadMembers();