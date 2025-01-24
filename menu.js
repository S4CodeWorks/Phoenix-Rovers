document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const menuHeading = document.querySelector('.menu-heading');
  const submenu = document.querySelector('.submenu');
  const headerBackdrop = document.querySelector('.header-backdrop');
  
  // Toggle main menu with animation coordination
  const toggleMenu = (show) => {
    menuToggle.classList.toggle('active', show);
    mainNav.classList.toggle('active', show);
    headerBackdrop.classList.toggle('active', show);
    
    if (show) {
      // Animate menu items in
      document.querySelectorAll('.submenu-item').forEach((item, index) => {
        item.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
      });
    } else {
      // Reset animations
      document.querySelectorAll('.submenu-item').forEach(item => {
        item.style.animation = '';
      });
      submenu.classList.remove('active');
      menuHeading.classList.remove('active');
    }
  };
  
  menuToggle.addEventListener('click', () => {
    const willShow = !mainNav.classList.contains('active');
    toggleMenu(willShow);
  });
  
  // Toggle submenu with smooth height transition
  menuHeading.addEventListener('click', () => {
    const willShow = !submenu.classList.contains('active');
    menuHeading.classList.toggle('active', willShow);
    
    if (willShow) {
      submenu.style.height = 'auto';
      const height = submenu.clientHeight + 'px';
      submenu.style.height = '0px';
      setTimeout(() => {
        submenu.style.height = height;
      }, 0);
    } else {
      submenu.style.height = '0px';
    }
    
    submenu.classList.toggle('active', willShow);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const isClickInside = mainNav.contains(e.target) || menuToggle.contains(e.target);
    
    if (!isClickInside && mainNav.classList.contains('active')) {
      toggleMenu(false);
    }
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
        toggleMenu(false);
      }
    }, 250);
  });
  
  // Add hover effect for menu items
  document.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateX(5px)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateX(0)';
    });
  });

  // Add helper function to update match status
  const updateMatchStatus = (status) => {
    const statusElement = document.querySelector('.match-status');
    statusElement.className = 'match-status'; // Reset classes
  
    switch(status.toLowerCase()) {
      case 'to be defined':
        statusElement.classList.add('to-be-defined');
        statusElement.textContent = 'TO BE DEFINED';
        break;
      case 'in progress':
        statusElement.classList.add('in-progress');
        statusElement.textContent = 'IN PROGRESS';
        break;
      case 'finished':
        statusElement.classList.add('finished');
        statusElement.textContent = 'FINALIZED';
        break;
    }
  };

  // Example usage:
  // updateMatchStatus('in progress');
});

// Add these styles to handle animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);