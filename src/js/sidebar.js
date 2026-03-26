/* ============================================
   SIDEBAR MANAGER
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const shell = document.getElementById('app-shell');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  
  const collapseBtn = document.getElementById('sidebar-collapse-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  
  const SIDEBAR_KEY = 'ipl-sidebar-collapsed';

  // Desktop Collapse
  function toggleSidebarCollapse() {
    const isCollapsed = shell.classList.toggle('sidebar-collapsed');
    localStorage.setItem(SIDEBAR_KEY, String(isCollapsed));
    
    // Trigger window resize for charts to recalculate after transition
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  if (collapseBtn) collapseBtn.addEventListener('click', toggleSidebarCollapse);

  // Restore state
  if (localStorage.getItem(SIDEBAR_KEY) === 'true') {
    shell?.classList.add('sidebar-collapsed');
  }

  // Mobile Drawer
  function openMobileSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('visible');
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('visible');
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileSidebar);
  if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

  // Mark active nav based on current URL path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
