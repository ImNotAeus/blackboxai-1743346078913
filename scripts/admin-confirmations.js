// Admin action confirmations
function setupConfirmations() {
    // Logout confirmation
    const logoutBtn = document.querySelector('button[onclick*="logout"]');
    if (logoutBtn) {
        logoutBtn.onclick = function(e) {
            if (!confirm('Are you sure you want to logout?')) {
                e.preventDefault();
            }
        };
    }

    // User deletion confirmations
    document.querySelectorAll('button:contains("Delete")').forEach(btn => {
        btn.onclick = function(e) {
            if (!confirm('WARNING: This will permanently delete the user. Continue?')) {
                e.preventDefault();
            }
        };
    });

    // Alert resolution confirmations
    document.querySelectorAll('button:contains("Resolve")').forEach(btn => {
        btn.onclick = function(e) {
            if (!confirm('Are you sure you want to mark this alert as resolved?')) {
                e.preventDefault();
            }
        };
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupConfirmations);