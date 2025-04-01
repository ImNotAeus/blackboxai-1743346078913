// Enhanced Authentication Module with logout confirmation
document.addEventListener('DOMContentLoaded', function() {
  // Initialize users array in localStorage if not exists
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      { 
        id: 1, 
        name: 'Admin User', 
        email: 'admin@emergency.com', 
        password: btoa('Admin@123'), 
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ]));
  }

  // Handle registration form submission
  if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
      e.preventDefault();
      registerUser();
    });
  }

  // Handle login form submission
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      loginUser();
    });
  }
});

// User Registration
function registerUser() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Basic validation
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    alert('Password must be at least 8 characters with 1 uppercase letter and 1 number');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users'));
  const userExists = users.some(user => user.email === email);

  if (userExists) {
    alert('User with this email already exists!');
    return;
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: btoa(password), // Basic encoding (not secure for production)
    role: 'user',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  alert('Registration successful! Redirecting to dashboard...');
  window.location.href = 'dashboard.html';
}

// User Login
function loginUser() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('remember-me')?.checked;

  const users = JSON.parse(localStorage.getItem('users'));
  const user = users.find(user => user.email === email && atob(user.password) === password);

  if (!user) {
    alert('Invalid email or password!');
    return;
  }

  // Store current user session
  localStorage.setItem('currentUser', JSON.stringify(user));
  if (rememberMe) {
    localStorage.setItem('rememberedEmail', email);
  } else {
    localStorage.removeItem('rememberedEmail');
  }

  // Redirect based on role
  if (user.role === 'admin') {
    window.location.href = 'admin-dashboard.html';
  } else {
    window.location.href = 'dashboard.html';
  }
}

// Check authentication status
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const path = window.location.pathname.split('/').pop();

  // Redirect to login if not authenticated
  if (!currentUser && !['login.html', 'register.html'].includes(path)) {
    window.location.href = 'login.html';
    return false;
  }

  // Redirect away from auth pages if already logged in
  if (currentUser && ['login.html', 'register.html'].includes(path)) {
    window.location.href = currentUser.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
    return false;
  }

  // Protect admin routes
  if (path === 'admin-dashboard.html' && currentUser?.role !== 'admin') {
    alert('Unauthorized access!');
    window.location.href = 'dashboard.html';
    return false;
  }

  return true;
}

// Enhanced Logout function with confirmation
function confirmLogout() {
  const confirmation = confirm('Are you sure you want to logout?\n\nAny unsaved changes will be lost.');
  if (confirmation) {
    logout();
  }
}

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}