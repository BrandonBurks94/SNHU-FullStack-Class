(function () {
  const tokenKey = 'travlr-public-token';
  const userKey = 'travlr-public-user';
  const reservationsKey = 'travlr-public-reservations';

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem(userKey) || 'null');
    } catch {
      return null;
    }
  };

  const getReservations = () => {
    try {
      return JSON.parse(localStorage.getItem(reservationsKey) || '[]');
    } catch {
      return [];
    }
  };

  const saveAuth = (token, user) => {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(userKey, JSON.stringify(user));
  };

  const userFromToken = (token, fallback) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return {
        email: payload.email || fallback.email,
        name: payload.name || fallback.name || fallback.email
      };
    } catch {
      return fallback;
    }
  };

  const isLoggedIn = () => Boolean(localStorage.getItem(tokenKey) && getUser());

  const setMessage = (id, message, className) => {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    element.textContent = message;
    element.className = className || 'travlr-message';
  };

  const updateAccountStatus = () => {
    const status = document.getElementById('accountStatus');

    if (!status) {
      return;
    }

    const user = getUser();

    if (!isLoggedIn()) {
      status.innerHTML = 'You are not logged in. <a href="login.html">Log in</a> or <a href="signup.html">create an account</a>.';
      return;
    }

    status.innerHTML = `Logged in as <strong>${user.name || user.email}</strong>. <button type="button" id="logoutButton">Log out</button>`;
    document.getElementById('logoutButton').addEventListener('click', () => {
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
      window.location.href = 'login.html';
    });
  };

  const updateNavigation = () => {
    const loggedIn = isLoggedIn();

    document.querySelectorAll('a[href$="reservations.html"], a[href*="reservations.html?"]').forEach((link) => {
      const listItem = link.closest('li');

      if (listItem) {
        listItem.style.visibility = loggedIn ? 'visible' : 'hidden';
      }
    });

    document.querySelectorAll('a[href$="login.html"]').forEach((link) => {
      if (!loggedIn) {
        link.textContent = 'Login';
        return;
      }

      link.textContent = 'Sign Out';
      link.setAttribute('href', '#');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        window.location.href = 'login.html';
      });
    });
  };

  const handleLogin = () => {
    const form = document.getElementById('loginForm');

    if (!form) {
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = form.email.value.trim();
      const password = form.password.value;

      if (!email || !password) {
        setMessage('loginMessage', 'Email and password are required.', 'travlr-message error');
        return;
      }

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.message || 'Login failed.');
        }

        saveAuth(body.token, userFromToken(body.token, { email, name: email }));
        window.location.href = 'reservations.html';
      } catch (err) {
        setMessage('loginMessage', err.message, 'travlr-message error');
      }
    });
  };

  const handleSignup = () => {
    const form = document.getElementById('signupForm');

    if (!form) {
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;
      const confirmPassword = form.confirmPassword.value;

      if (!name || !email || !password || !confirmPassword) {
        setMessage('signupMessage', 'All fields are required.', 'travlr-message error');
        return;
      }

      if (password !== confirmPassword) {
        setMessage('signupMessage', 'Passwords must match.', 'travlr-message error');
        return;
      }

      if (!form.terms.checked) {
        setMessage('signupMessage', 'You must agree to the terms before signing up.', 'travlr-message error');
        return;
      }

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.message || 'Sign up failed.');
        }

        saveAuth(body.token, { email, name });
        window.location.href = 'reservations.html';
      } catch (err) {
        setMessage('signupMessage', err.message, 'travlr-message error');
      }
    });
  };

  const renderReservations = () => {
    const container = document.getElementById('reservationList');

    if (!container) {
      return;
    }

    const form = document.getElementById('reservationForm');

    if (!isLoggedIn()) {
      container.innerHTML = '<p>Please log in to view or create reservations.</p>';
      if (form) {
        form.style.display = 'none';
      }
      return;
    }

    if (form) {
      form.style.display = '';
    }

    const reservations = getReservations();

    if (!reservations.length) {
      container.innerHTML = '<p>No reservations yet. Choose a package from the Travel page to begin.</p>';
      return;
    }

    container.innerHTML = reservations.map((reservation) => `
      <div class="reservation-item">
        <h2>${reservation.name}</h2>
        <p><strong>Code:</strong> ${reservation.code}</p>
        <p><strong>Duration:</strong> ${reservation.duration}</p>
        <p><strong>Price:</strong> ${reservation.price}</p>
      </div>
    `).join('');
  };

  const handleReservationForm = () => {
    const form = document.getElementById('reservationForm');

    if (!form) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    form.code.value = params.get('code') || '';
    form.name.value = params.get('name') || '';
    form.duration.value = params.get('duration') || '';
    form.price.value = params.get('price') || '';

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
      }

      const reservation = {
        code: form.code.value.trim(),
        name: form.name.value.trim(),
        duration: form.duration.value.trim(),
        price: form.price.value.trim()
      };

      if (!reservation.code || !reservation.name) {
        setMessage('reservationMessage', 'Choose a trip from the Travel page before reserving.', 'travlr-message error');
        return;
      }

      const reservations = getReservations();
      reservations.push(reservation);
      localStorage.setItem(reservationsKey, JSON.stringify(reservations));
      setMessage('reservationMessage', `${reservation.name} was added to your itinerary.`, 'travlr-message success');
      renderReservations();
    });
  };

  updateAccountStatus();
  updateNavigation();
  handleLogin();
  handleSignup();
  handleReservationForm();
  renderReservations();
}());
