// ====================================
// Storage and Data Management
// ====================================

const StorageManager = {
  KEYS: {
    DEPARTMENTS: 'departments_data',
    SESSION: 'current_session',
  },

  initializeDepartments() {
    if (!localStorage.getItem(this.KEYS.DEPARTMENTS)) {
      const defaultData = {
        CS: [
          {
            id: 1,
            title: 'TechFest 2025',
            description: 'Annual coding competition for Computer Science students. Showcase your programming skills and compete with peers from other colleges.',
            date: '2025-11-15',
            time: '10:00 AM',
            venue: 'Auditorium A',
            image: null,
            video: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'Web Development Workshop',
            description: 'Learn modern web development frameworks and best practices. Hands-on session with industry experts covering React, Vue, and Angular.',
            date: '2025-12-01',
            time: '02:00 PM',
            venue: 'Computer Lab 1',
            image: null,
            video: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            title: 'AI and Machine Learning Summit',
            description: 'Explore the future of artificial intelligence and machine learning. Keynote speakers from leading tech companies sharing insights and innovations.',
            date: '2025-10-20',
            time: '09:00 AM',
            venue: 'Auditorium B',
            image: null,
            video: null,
            createdAt: new Date().toISOString(),
          },
        ],
        EE: [
          {
            id: 101,
            title: 'Power Systems Seminar',
            description: 'Understanding modern power distribution systems and renewable energy integration. Expert presentations on smart grids and energy management.',
            date: '2025-11-10',
            time: '11:00 AM',
            venue: 'Lecture Hall 2',
            image: null,
            video: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: 102,
            title: 'Circuit Design Competition',
            description: 'Design and build innovative electronic circuits. Compete with other departments and win exciting prizes. All materials provided.',
            date: '2025-11-25',
            time: '03:00 PM',
            venue: 'Electronics Lab',
            image: null,
            video: null,
            createdAt: new Date().toISOString(),
          },
        ],
        ME: [
          {
            id: 201,
            title: 'Mechanical Design Workshop',
            description: 'Learn CAD design principles using industry-standard software. Create 3D models and understand design optimization techniques.',
            date: '2025-11-20',
            time: '10:00 AM',
            venue: 'Design Lab',
            image: null,
            video: null,
            createdAt: new Date().toISOString(),
          },
        ],
        CIVIL: [
          {
            id: 301,
            title: 'Structural Engineering Expo',
            description: 'Discover innovations in structural design and construction technology. Interactive displays of modern building techniques and materials.',
            date: '2025-12-05',
            time: '01:00 PM',
            venue: 'Conference Room',
            image: null,
            video: null,
            createdAt: new Date().toISOString(),
          },
        ],
        ECE: [
          {
            id: 401,
            title: 'Embedded Systems Bootcamp',
            description: 'Master embedded systems programming and IoT applications. Learn to develop smart devices and connected solutions.',
            date: '2025-11-18',
            time: '02:00 PM',
            venue: 'Lab 3',
            image: null,
            video: null,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      localStorage.setItem(this.KEYS.DEPARTMENTS, JSON.stringify(defaultData));
    }
  },

  getDepartmentEvents(department) {
    const data = JSON.parse(localStorage.getItem(this.KEYS.DEPARTMENTS) || '{}');
    return data[department] || [];
  },

  saveEvent(department, event) {
    const data = JSON.parse(localStorage.getItem(this.KEYS.DEPARTMENTS) || '{}');
    if (!data[department]) {
      data[department] = [];
    }
    data[department].push(event);
    localStorage.setItem(this.KEYS.DEPARTMENTS, JSON.stringify(data));
  },

  updateEvent(department, eventId, updatedEvent) {
    const data = JSON.parse(localStorage.getItem(this.KEYS.DEPARTMENTS) || '{}');
    if (data[department]) {
      const index = data[department].findIndex((e) => e.id === eventId);
      if (index !== -1) {
        data[department][index] = { ...data[department][index], ...updatedEvent };
        localStorage.setItem(this.KEYS.DEPARTMENTS, JSON.stringify(data));
        return true;
      }
    }
    return false;
  },

  deleteEvent(department, eventId) {
    const data = JSON.parse(localStorage.getItem(this.KEYS.DEPARTMENTS) || '{}');
    if (data[department]) {
      data[department] = data[department].filter((e) => e.id !== eventId);
      localStorage.setItem(this.KEYS.DEPARTMENTS, JSON.stringify(data));
      return true;
    }
    return false;
  },

  setSession(department) {
    const departmentNames = {
      CS: 'Computer Science',
      EE: 'Electrical Engineering',
      ME: 'Mechanical Engineering',
      CIVIL: 'Civil Engineering',
      ECE: 'Electronics and Communication',
    };
    localStorage.setItem(
      this.KEYS.SESSION,
      JSON.stringify({
        department,
        departmentName: departmentNames[department] || department,
        loginTime: new Date().toISOString(),
      }),
    );
  },

  getSession() {
    const session = localStorage.getItem(this.KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  clearSession() {
    localStorage.removeItem(this.KEYS.SESSION);
  },
};

// ====================================
// Authentication
// ====================================

const AuthManager = {
  credentials: {
    CS: '1234',
    EE: '5678',
    ME: '9012',
    CIVIL: '3456',
    ECE: '7890',
  },

  login(department, password) {
    const trimmedDept = department.toUpperCase().trim();
    if (this.credentials[trimmedDept] && this.credentials[trimmedDept] === password) {
      StorageManager.setSession(trimmedDept);
      return { success: true };
    }
    return { success: false, error: 'Invalid department code or password.' };
  },

  logout() {
    StorageManager.clearSession();
  },

  isAuthenticated() {
    return StorageManager.getSession() !== null;
  },
};

// ====================================
// Utilities
// ====================================

const Utils = {
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  isEventUpcoming(dateString) {
    return new Date(dateString) > new Date();
  },

  generateId() {
    return Math.max(
      ...StorageManager.getDepartmentEvents(StorageManager.getSession().department).map((e) => e.id),
      0,
    ) + 1;
  },

  showNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    toast.textContent = message;
    toast.className = `notification-toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  },

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};

// ====================================
// Login Page Logic
// ====================================

function initializeLoginPage() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const forgotLink = document.getElementById('forgotLink');

  if (!loginForm) return;

  StorageManager.initializeDepartments();

  if (AuthManager.isAuthenticated()) {
    window.location.href = 'events.html';
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.remove('show');

    const department = document.getElementById('departmentCode').value.trim();
    const password = document.getElementById('password').value;

    if (!department || !password) {
      showLoginError('Please fill in all fields.');
      return;
    }

    const result = AuthManager.login(department, password);
    if (result.success) {
      loginForm.style.opacity = '0.6';
      loginForm.style.pointerEvents = 'none';
      setTimeout(() => {
        window.location.href = 'events.html';
      }, 500);
    } else {
      showLoginError(result.error);
      document.getElementById('password').value = '';
      document.getElementById('departmentCode').focus();
    }
  });

  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    Utils.showNotification('Please contact the administration office to reset your password.', 'warning');
  });

  function showLoginError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
      errorMessage.classList.remove('show');
    }, 4000);
  }
}

// ====================================
// Events Page Logic
// ====================================

class EventsPageManager {
  constructor() {
    this.session = StorageManager.getSession();
    this.currentEditingEventId = null;

    if (!this.session) {
      window.location.href = 'index.html';
      return;
    }

    this.initialize();
  }

  initialize() {
    this.setupEventListeners();
    this.updateHeader();
    this.renderEvents();
  }

  setupEventListeners() {
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
      this.logout();
    });

    const eventForm = document.getElementById('eventForm');
    eventForm.addEventListener('submit', (e) => {
      this.handleEventFormSubmit(e);
    });

    const imageInput = document.getElementById('eventImage');
    imageInput.addEventListener('change', (e) => {
      this.handleImagePreview(e);
    });

    const videoInput = document.getElementById('eventVideo');
    videoInput.addEventListener('change', (e) => {
      this.handleVideoPreview(e);
    });

    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalFooterBtn = document.getElementById('closeModalFooterBtn');
    closeModalBtn.addEventListener('click', () => this.closeModal());
    closeModalFooterBtn.addEventListener('click', () => this.closeModal());

    const editEventBtn = document.getElementById('editEventBtn');
    const deleteEventBtn = document.getElementById('deleteEventBtn');
    editEventBtn.addEventListener('click', () => this.switchToEditMode());
    deleteEventBtn.addEventListener('click', () => this.deleteCurrentEvent());

    document.getElementById('eventModal').addEventListener('click', (e) => {
      if (e.target.id === 'eventModal') {
        this.closeModal();
      }
    });
  }

  updateHeader() {
    const greeting = document.getElementById('departmentGreeting');
    greeting.textContent = `Welcome, ${this.session.departmentName} Department HOD`;
  }

  switchTab(tabName) {
    document.querySelectorAll('.nav-tab').forEach((tab) => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');

    if (tabName === 'upcoming' || tabName === 'past') {
      this.renderEvents(tabName);
    }
  }

  renderEvents(filterType = 'upcoming') {
    const events = StorageManager.getDepartmentEvents(this.session.department);
    const now = new Date();

    let filteredEvents = events;
    if (filterType === 'upcoming') {
      filteredEvents = events.filter((e) => new Date(e.date) > now);
    } else if (filterType === 'past') {
      filteredEvents = events.filter((e) => new Date(e.date) <= now);
    }

    const containerId = filterType === 'upcoming' ? 'upcomingEvents' : 'pastEvents';
    const container = document.getElementById(containerId);

    if (filteredEvents.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>${filterType === 'upcoming' ? 'No upcoming events. Create one to get started!' : 'No past events yet.'}</p></div>`;
      return;
    }

    container.innerHTML = filteredEvents
      .map((event) => this.createEventCard(event, filterType === 'past'))
      .join('');

    container.querySelectorAll('.event-card').forEach((card) => {
      const eventId = parseInt(card.dataset.eventId);
      const event = filteredEvents.find((e) => e.id === eventId);

      card.querySelector('.btn-view').addEventListener('click', () => {
        this.openEventModal(event);
      });

      card.querySelector('.btn-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEditModal(event);
      });
    });
  }

  createEventCard(event, isPast = false) {
    const mediaHtml = event.image
      ? `<img src="${event.image}" alt="${event.title}">`
      : event.video
        ? `<video src="${event.video}" muted></video>`
        : '<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">📅</div>';

    const pastClass = isPast ? 'past' : '';

    return `
      <div class="event-card ${pastClass}" data-event-id="${event.id}">
        <div class="event-image">${mediaHtml}</div>
        <div class="event-content">
          <h3 class="event-title">${this.escapeHtml(event.title)}</h3>
          <div class="event-meta">
            <span>📅 ${Utils.formatDate(event.date)}</span>
          </div>
          <div class="event-meta">
            <span>🕐 ${event.time}</span>
          </div>
          <div class="event-meta">
            <span>📍 ${this.escapeHtml(event.venue)}</span>
          </div>
          <p class="event-description">${this.escapeHtml(event.description)}</p>
          <div class="event-actions">
            <button class="btn-view">View Details</button>
            <button class="btn-edit">Edit</button>
          </div>
        </div>
      </div>
    `;
  }

  openEventModal(event) {
    this.currentEditingEventId = event.id;
    const modal = document.getElementById('eventModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalEventContent');

    title.textContent = 'Event Details';

    const mediaHtml = event.image
      ? `<img src="${event.image}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" alt="${event.title}">`
      : event.video
        ? `<video src="${event.video}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem; max-height: 300px;" controls></video>`
        : '';

    content.innerHTML = `
      ${mediaHtml}
      <h3 style="color: var(--primary-blue); margin-bottom: 0.5rem;">${this.escapeHtml(event.title)}</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;"><strong>Date:</strong> ${Utils.formatDate(event.date)}</p>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;"><strong>Time:</strong> ${event.time}</p>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;"><strong>Venue:</strong> ${this.escapeHtml(event.venue)}</p>
      <p style="color: var(--text-secondary); line-height: 1.6;"><strong>Description:</strong><br>${this.escapeHtml(event.description)}</p>
    `;

    modal.classList.add('active');
  }

  openEditModal(event) {
    this.currentEditingEventId = event.id;
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalEventContent');
    const modal = document.getElementById('eventModal');

    title.textContent = 'Edit Event';

    const mediaHtml = event.image
      ? `<img src="${event.image}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem; max-height: 200px;" alt="${event.title}">`
      : event.video
        ? `<video src="${event.video}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem; max-height: 200px;" controls></video>`
        : '';

    content.innerHTML = `
      <form id="editEventForm" style="display: flex; flex-direction: column; gap: 1rem;">
        ${mediaHtml}
        <div class="form-group">
          <label>Event Title</label>
          <input type="text" id="editTitle" value="${this.escapeHtml(event.title)}" required>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="editDate" value="${event.date}" required>
        </div>
        <div class="form-group">
          <label>Time</label>
          <input type="time" id="editTime" value="${event.time}" required>
        </div>
        <div class="form-group">
          <label>Venue</label>
          <input type="text" id="editVenue" value="${this.escapeHtml(event.venue)}" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="editDescription" required style="min-height: 100px;">${this.escapeHtml(event.description)}</textarea>
        </div>
        <div class="form-group">
          <label>Update Image</label>
          <input type="file" id="editImage" accept="image/*">
        </div>
        <div class="form-group">
          <label>Update Video</label>
          <input type="file" id="editVideo" accept="video/mp4">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button type="submit" class="btn-primary" style="flex: 1;">Save Changes</button>
          <button type="button" class="btn-secondary" id="cancelEditBtn" style="flex: 1;">Cancel</button>
        </div>
      </form>
    `;

    document.getElementById('editEventForm').addEventListener('submit', (e) => {
      this.handleEditEventSubmit(e, event);
    });

    document.getElementById('cancelEditBtn').addEventListener('click', () => {
      this.openEventModal(event);
    });

    document.getElementById('editImage').addEventListener('change', (e) => {
      this.handleEditImagePreview(e);
    });

    document.getElementById('editVideo').addEventListener('change', (e) => {
      this.handleEditVideoPreview(e);
    });

    modal.classList.add('active');
  }

  async handleEditEventSubmit(e, originalEvent) {
    e.preventDefault();

    const updatedEvent = {
      title: document.getElementById('editTitle').value,
      date: document.getElementById('editDate').value,
      time: document.getElementById('editTime').value,
      venue: document.getElementById('editVenue').value,
      description: document.getElementById('editDescription').value,
    };

    const imageInput = document.getElementById('editImage');
    if (imageInput.files.length > 0) {
      updatedEvent.image = await Utils.fileToBase64(imageInput.files[0]);
    }

    const videoInput = document.getElementById('editVideo');
    if (videoInput.files.length > 0) {
      updatedEvent.video = await Utils.fileToBase64(videoInput.files[0]);
    }

    StorageManager.updateEvent(this.session.department, originalEvent.id, updatedEvent);
    this.closeModal();
    this.renderEvents('upcoming');
    Utils.showNotification('Event updated successfully!', 'success');
  }

  switchToEditMode() {
    const event = StorageManager.getDepartmentEvents(this.session.department).find(
      (e) => e.id === this.currentEditingEventId,
    );
    if (event) {
      this.openEditModal(event);
    }
  }

  deleteCurrentEvent() {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      StorageManager.deleteEvent(this.session.department, this.currentEditingEventId);
      this.closeModal();
      this.renderEvents('upcoming');
      Utils.showNotification('Event deleted successfully!', 'success');
    }
  }

  closeModal() {
    const modal = document.getElementById('eventModal');
    modal.classList.remove('active');
    this.currentEditingEventId = null;
  }

  async handleEventFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const venue = document.getElementById('eventVenue').value.trim();
    const description = document.getElementById('eventDescription').value.trim();

    if (!title || !date || !time || !venue || !description) {
      Utils.showNotification('Please fill in all required fields.', 'error');
      return;
    }

    if (description.split(' ').length < 5) {
      Utils.showNotification('Description must be at least 5 words long.', 'error');
      return;
    }

    const event = {
      id: Utils.generateId(),
      title,
      date,
      time,
      venue,
      description,
      image: null,
      video: null,
      createdAt: new Date().toISOString(),
    };

    const imageInput = document.getElementById('eventImage');
    if (imageInput.files.length > 0) {
      event.image = await Utils.fileToBase64(imageInput.files[0]);
    }

    const videoInput = document.getElementById('eventVideo');
    if (videoInput.files.length > 0) {
      if (!videoInput.files[0].type.includes('video/mp4')) {
        Utils.showNotification('Only MP4 video format is supported.', 'error');
        return;
      }
      event.video = await Utils.fileToBase64(videoInput.files[0]);
    }

    StorageManager.saveEvent(this.session.department, event);

    document.getElementById('eventForm').reset();
    document.getElementById('imagePreview').classList.remove('active');
    document.getElementById('videoPreview').classList.remove('active');

    this.renderEvents('upcoming');
    this.switchTab('upcoming');

    Utils.showNotification('Event created successfully!', 'success');
  }

  handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        preview.classList.add('active');
      };
      reader.readAsDataURL(file);
    }
  }

  handleVideoPreview(e) {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes('video/mp4')) {
        Utils.showNotification('Only MP4 format is supported.', 'error');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = document.getElementById('videoPreview');
        preview.innerHTML = `<video src="${event.target.result}" controls></video>`;
        preview.classList.add('active');
      };
      reader.readAsDataURL(file);
    }
  }

  handleEditImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const contentDiv = document.getElementById('modalEventContent');
        let img = contentDiv.querySelector('img:not(#closeModalBtn *)');
        if (!img) {
          img = document.createElement('img');
          contentDiv.insertBefore(img, contentDiv.firstChild);
        }
        img.src = event.target.result;
        img.style.width = '100%';
        img.style.borderRadius = '8px';
        img.style.marginBottom = '1rem';
        img.style.maxHeight = '200px';
      };
      reader.readAsDataURL(file);
    }
  }

  handleEditVideoPreview(e) {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes('video/mp4')) {
        Utils.showNotification('Only MP4 format is supported.', 'error');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const contentDiv = document.getElementById('modalEventContent');
        let video = contentDiv.querySelector('video');
        if (!video) {
          video = document.createElement('video');
          video.controls = true;
          contentDiv.insertBefore(video, contentDiv.firstChild);
        }
        video.src = event.target.result;
        video.style.width = '100%';
        video.style.borderRadius = '8px';
        video.style.marginBottom = '1rem';
        video.style.maxHeight = '200px';
      };
      reader.readAsDataURL(file);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  logout() {
    AuthManager.logout();
    window.location.href = 'index.html';
  }
}

// ====================================
// Page Initialization
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loginForm')) {
    initializeLoginPage();
  } else if (document.getElementById('eventForm')) {
    new EventsPageManager();
  }
});
